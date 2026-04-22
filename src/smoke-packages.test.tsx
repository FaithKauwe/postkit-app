import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatDate, statusToLabel } from 'postkit-date-status-display'
import { createExcerpt } from 'postkit-excerpt'
import { filterByStatus } from 'postkit-filter-sort'
import { readingTime } from 'postkit-reading-time'
import { searchPosts } from 'postkit-search-library'
import { createSlugFromTitle } from 'postkit-slug'
import { parseTags } from 'postkit-tag'
import { validatePost } from 'postkit-validation-library'
import { SearchInput } from 'postkit-ui-component-library'
import type { Post } from './types'

/** Minimal `Post` matching `src/types.ts` — used for cross-package smoke checks. */
const samplePost: Post = {
  id: 'smoke-1',
  title: 'Hello World',
  body: 'Some body content for the post.',
  author: 'Ada',
  tags: ['demo', 'unit'],
  category: 'tech',
  status: 'draft',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

describe('PostKit dependency smoke tests', () => {
  it('postkit-slug: createSlugFromTitle returns a non-empty slug', () => {
    expect(createSlugFromTitle('Hello World')).toMatch(/hello/i)
  })

  it('postkit-excerpt: createExcerpt shortens long text', () => {
    const out = createExcerpt('This is a long post body that keeps going.', 30)
    expect(out.length).toBeLessThanOrEqual(35)
    expect(out).toContain('…')
  })

  it('postkit-reading-time: readingTime returns a number', () => {
    expect(readingTime('one two three four five')).toBeGreaterThan(0)
  })

  it('postkit-tag: parseTags splits input', () => {
    expect(parseTags('javascript, web dev')).toEqual(['javascript', 'web dev'])
  })

  it('postkit-filter-sort: filterByStatus keeps matching posts', () => {
    const drafts = filterByStatus([samplePost], 'draft')
    expect(drafts).toHaveLength(1)
    expect(drafts[0].id).toBe(samplePost.id)
  })

  it('postkit-search-library: searchPosts finds by title', () => {
    const results = searchPosts([samplePost], 'Hello')
    expect(results.length).toBeGreaterThanOrEqual(1)
  })

  it('postkit-validation-library: validatePost accepts a valid post', () => {
    const result = validatePost(samplePost)
    expect(result.valid).toBe(true)
  })

  it('postkit-date-status-display: formatDate and statusToLabel', () => {
    expect(formatDate(samplePost.createdAt)).toBe('January 1, 2026')
    expect(statusToLabel('draft')).toBe('Draft')
  })

  it('postkit-ui-component-library: SearchInput renders', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        aria-label="Search posts"
      />,
    )
    expect(screen.getByRole('searchbox', { name: 'Search posts' })).toBeInTheDocument()
  })

  // Skipped: `postkit-storage-lib` is listed in package.json but the published tarball has no
  // `index.js` at `main` — any import fails Vite's resolver. Re-enable this test after a fixed publish.
  it.skip('postkit-storage-lib: load and round-trip', () => {
    expect(true).toBe(true)
  })
})
