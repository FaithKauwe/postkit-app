import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { usePostStore } from './store/usePostStore'
import { makePost } from './test/factories'

const INITIAL_UI = {
  searchQuery: '',
  statusFilter: 'all' as const,
  tagFilter: '',
  sortBy: 'date' as const,
  sortDirection: 'desc' as const,
}

beforeEach(() => {
  usePostStore.setState({
    posts: [],
    selectedPostId: null,
    ...INITIAL_UI,
  })
})

describe('PostKit integration', () => {
  it('saving a valid new post adds it to the list, selects it, and updates preview', async () => {
    const title = 'And Now for Something Completely Blogging'
    const body =
      'Bring out your dead—or at least twenty characters—and do not omit the peril.'
    const user = userEvent.setup()

    render(<App />)
    // Flexible name match: when invalid, aria-describedby appends error text to the accessible name.
    const titleField = () => screen.getByRole('textbox', { name: /^title\b/i })
    const bodyField = () => screen.getByRole('textbox', { name: /^body\b/i })

    await user.type(titleField(), title)
    await user.type(screen.getByRole('textbox', { name: /^author$/i }), 'Brave Sir Robin')
    await user.type(bodyField(), body)
    await user.type(
      screen.getByRole('textbox', { name: /tags/i }),
      'shrubbery, herring',
    )
    await user.type(screen.getByRole('textbox', { name: /^category$/i }), 'Castle Anthrax')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    const state = usePostStore.getState()
    expect(state.posts).toHaveLength(1)
    expect(state.posts[0].title).toBe(title)
    expect(state.selectedPostId).toBe(state.posts[0].id)

    expect(screen.getAllByRole('heading', { level: 3, name: title })).toHaveLength(1)

    expect(screen.queryByText(/Select a post to preview it here/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it('invalid save shows validation alerts and keeps posts unchanged until fixed', async () => {
    const seed = makePost({
      id: 'seed-parrot-dept',
      title: 'How Not To Be Seen',
      author: 'The Colonel',
      tags: ['teaching', 'careers'],
      category: 'Public Broadcasting',
      body: 'Twenty chars of guidance here.',
      status: 'draft',
    })
    usePostStore.setState({ posts: [seed], selectedPostId: null, ...INITIAL_UI })

    const title = 'The Knights Who Say “Post”'
    const body = 'Ni! We demand shrubbery—and many more characters than twenty!'
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/body is required/i)).toBeInTheDocument()
    expect(usePostStore.getState().posts).toHaveLength(1)
    expect(usePostStore.getState().posts[0].title).toBe(seed.title)

    await user.type(screen.getByRole('textbox', { name: /^title\b/i }), title)
    await user.type(screen.getByRole('textbox', { name: /^body\b/i }), body)
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/body is required/i)).not.toBeInTheDocument()

    const after = usePostStore.getState()
    expect(after.posts).toHaveLength(2)
    expect(after.posts.map((p) => p.title)).toContain(seed.title)
    expect(after.posts.map((p) => p.title)).toContain(title)
    expect(after.selectedPostId).toBe(after.posts.find((p) => p.title === title)?.id ?? null)

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it('search narrows Your Posts to matching items (searchPosts + list)', async () => {
    const swallowTitle = 'What Is The Airspeed Velocity of an Unladen Swallow'
    const niTitle = 'We Are The Knights Who Say Ni'
    // set up additional posts to populate list to test searching 
    usePostStore.setState({
      posts: [
        makePost({
          id: 'search-a-swallow',
          title: swallowTitle,
          body: 'An African or European swallow? Must be twenty chars.',
          author: 'Bridgekeeper',
          tags: ['physics', 'birds'],
          category: 'Bridge of Death',
        }),
        makePost({
          id: 'search-b-ni',
          title: niTitle,
          body: 'We demand a shrubbery! Twenty characters of Ni.',
          author: 'Head Knight',
          tags: ['horticulture', 'surprise'],
          category: 'Forest',
        }),
      ],
      selectedPostId: null,
      ...INITIAL_UI,
    })

    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { level: 3, name: swallowTitle })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: niTitle })).toBeInTheDocument()

    const search = screen.getByRole('searchbox', { name: /search posts/i })
    await user.type(search, 'swallow')

    expect(screen.getByRole('heading', { level: 3, name: swallowTitle })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: niTitle }),
    ).not.toBeInTheDocument()
  })

  it('status filter and tag filter isolate posts (filterByStatus / filterByTag)', async () => {
    const draftTitle = 'The Mighty Quest for a Shrubbery (Draft Memo)'
    const publishedTitle = 'Lovely Spam, Wonderful Spam, Glorious Spam'
    const reviewTitle = 'Nobody Expects the Editorial Calendar'

    usePostStore.setState({
      posts: [
        makePost({
          id: 'filter-draft',
          title: draftTitle,
          status: 'draft',
          body: 'Twenty characters of shrubbery requirements go here.',
          tags: ['quest-knights'],
          author: 'Head Knight',
          category: 'Forestry Requests',
        }),
        makePost({
          id: 'filter-published',
          title: publishedTitle,
          status: 'published',
          body: 'Twenty characters explaining the breakfast menu racket.',
          tags: ['pork-products'],
          author: 'Mr. Lint',
          category: 'Cafeteria',
        }),
        makePost({
          id: 'filter-review',
          title: reviewTitle,
          status: 'review',
          body: 'Twenty chars for red pens and comfy chairs alas.',
          tags: ['comfy-chair'],
          author: 'Cardinal Fang',
          category: 'Infallibility',
        }),
      ],
      selectedPostId: null,
      ...INITIAL_UI,
    })

    const user = userEvent.setup()
    render(<App />)

    for (const t of [draftTitle, publishedTitle, reviewTitle]) {
      expect(screen.getByRole('heading', { level: 3, name: t })).toBeInTheDocument()
    }

    const statusSelect = screen.getByRole('combobox', {
      name: /filter by status/i,
    })

    await user.selectOptions(statusSelect, 'draft')
    expect(screen.getByRole('heading', { level: 3, name: draftTitle })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: publishedTitle }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: reviewTitle }),
    ).not.toBeInTheDocument()

    await user.selectOptions(statusSelect, 'all')
    const tagFilter = screen.getByRole('combobox', { name: /filter by tag/i })
    await user.type(tagFilter, 'pork-products')
    expect(
      screen.getByRole('heading', { level: 3, name: publishedTitle }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: draftTitle }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: reviewTitle }),
    ).not.toBeInTheDocument()

    await user.clear(tagFilter)

    await user.selectOptions(statusSelect, 'review')
    expect(
      screen.getByRole('heading', { level: 3, name: reviewTitle }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: draftTitle }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: publishedTitle }),
    ).not.toBeInTheDocument()
  })

  it('sort by date and sort by title reorder post cards', async () => {
    const zeKnight = `Ze Nights Who Say Meh (Annex)`
    const itsCats = `It's Nobody's Fault But the Cat`
    const alwaysMousse = 'Always Remember the Salmon Mousse Incident'

    usePostStore.setState({
      posts: [
        makePost({
          id: 'sort-ze-old',
          title: zeKnight,
          status: 'draft',
          body: 'Twenty characters of annex paperwork for the swamp.',
          createdAt: '2026-02-07T09:00:00.000Z',
          updatedAt: '2026-02-07T09:00:00.000Z',
        }),
        makePost({
          id: 'sort-cats-mid',
          title: itsCats,
          status: 'draft',
          body: 'Twenty characters blaming the moggy for diplomacy.',
          createdAt: '2026-06-03T09:00:00.000Z',
          updatedAt: '2026-06-03T09:00:00.000Z',
        }),
        makePost({
          id: 'sort-mousse-new',
          title: alwaysMousse,
          status: 'draft',
          body: 'Twenty cautionary pudding characters tonight alas.',
          createdAt: '2026-09-09T09:00:00.000Z',
          updatedAt: '2026-09-09T09:00:00.000Z',
        }),
      ],
      selectedPostId: null,
      ...INITIAL_UI,
    })

    const user = userEvent.setup()
    render(<App />)

    const titlesInDOMOrder = () =>
      screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent ?? '')

    const sortFieldSelect = screen.getByRole('combobox', {
      name: /sort by field/i,
    })
    const sortDirection = screen.getByRole('combobox', {
      name: /sort direction/i,
    })

    expect(titlesInDOMOrder()).toEqual([alwaysMousse, itsCats, zeKnight])

    await user.selectOptions(sortDirection, 'asc')
    expect(titlesInDOMOrder()).toEqual([zeKnight, itsCats, alwaysMousse])

    await user.selectOptions(sortDirection, 'desc')
    await user.selectOptions(sortFieldSelect, 'title')
    await user.selectOptions(sortDirection, 'asc')
    expect(titlesInDOMOrder()).toEqual([alwaysMousse, itsCats, zeKnight])

    await user.selectOptions(sortDirection, 'desc')
    expect(titlesInDOMOrder()).toEqual([zeKnight, itsCats, alwaysMousse])
  })

  it('preview shows placeholder until a card is picked, then title slug dates status and excerpt', async () => {
    const noiseTitle = 'A Short Intermission Announcement'
    const heroTitle = 'The Complete History of British Teahouses in Avalon'
    const noisyBodyShort = 'Curtain lifts. Twenty characters suffice here.'
    const heroBodyOpening =
      'CHEESE SHOP TABLE READ: Wensleydale availability and Venezuelan beaver rumors in excruciating detail. '
    const heroBodyLong = `${heroBodyOpening}${'More cheese facts and silly walks. '.repeat(25)}`.trim()

    const createdAt = '2026-04-03T14:22:33.000Z'
    const updatedAt = '2026-08-08T09:05:01.000Z'

    usePostStore.setState({
      posts: [
        makePost({
          id: 'preview-noise',
          title: noiseTitle,
          body: noisyBodyShort,
          status: 'published',
          createdAt,
          updatedAt: createdAt,
          author: 'Curtain Keeper',
          category: 'Intermissions',
          tags: ['bells'],
        }),
        makePost({
          id: 'preview-hero',
          title: heroTitle,
          body: heroBodyLong,
          status: 'draft',
          author: 'Mrs. Arthur Name',
          category: 'Dairy Dramaturgy',
          tags: ['wensleydale', 'peppercorn'],
          createdAt,
          updatedAt,
        }),
      ],
      selectedPostId: null,
      ...INITIAL_UI,
    })

    const user = userEvent.setup()
    render(<App />)

    expect(
      screen.getByText(/Select a post to preview it here/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    await user.click(screen.getByRole('heading', { level: 3, name: heroTitle }))

    expect(
      screen.queryByText(/Select a post to preview it here/i),
    ).not.toBeInTheDocument()

    expect(usePostStore.getState().selectedPostId).toBe('preview-hero')

    const article = screen.getByRole('article')
    expect(
      within(article).getByRole('heading', { level: 1, name: heroTitle }),
    ).toBeInTheDocument()

    expect(within(article).getByText('Slug')).toBeInTheDocument()
    expect(within(article).getByRole('code')).toBeInTheDocument()

    expect(article.textContent).toContain('April 3, 2026')
    expect(article.textContent).toContain('August 8, 2026')

    expect(within(article).getByText(/Mrs\. Arthur Name/i)).toBeInTheDocument()
    expect(within(article).getByText('Draft')).toBeInTheDocument()

    expect(article.textContent).toContain('CHEESE SHOP TABLE READ')
    expect(article.textContent).toContain('…')

    expect(within(article).getByText('Category: Dairy Dramaturgy')).toBeInTheDocument()

    expect(within(article).getByText('wensleydale')).toBeInTheDocument()
    expect(within(article).getByText('peppercorn')).toBeInTheDocument()
  })
})
