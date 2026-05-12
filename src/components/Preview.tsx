import { createSlugFromTitle, makeUniqueSlug } from 'postkit-slug'
import { usePostStore } from '../store/usePostStore'
import { formatDate, statusToLabel, statusToColor } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { createExcerpt } from 'postkit-excerpt'
import type { Post } from '../types'

// takes one new post and the list of existing posts, uses functions from slug library to convert title to slug
// then compare against existing slugs and make sure the returned one is unique
function uniqueSlugForPost(post: Post, allPosts: Post[]): string | null {
  try {
    const base = createSlugFromTitle(post.title)
    const existingSlugs = allPosts
      .filter((p) => p.id !== post.id)
      .map((p) => createSlugFromTitle(p.title))
    return makeUniqueSlug(base, existingSlugs)
  } catch {
    return null
  }
}

function Preview() {
  const posts = usePostStore((state) => state.posts)
  const selectedPostId = usePostStore((state) => state.selectedPostId)
  
  // use built in JS method find()to match the selectedPostId in the array of posts
  const post = posts.find((p) => p.id === selectedPostId)
  const slug = post ? uniqueSlugForPost(post, posts) : null
  const statusLabel = post ? statusToLabel(post.status) ?? post.status : null
  const statusColorTok = post ? statusToColor(post.status) : null

  // If nothing is selected, show placeholder
  if (!post) {
    return (
      <section className="mb-8 p-5 rounded-lg border border-yellow-700" style={{ background: '#292524' }}>
        <h2 className="text-xl font-bold mb-4 !text-yellow-400 border-b border-yellow-800 pb-2">🏰 Preview</h2>
        <p className="text-stone-400">Select a post to preview it here</p>
      </section>
    )
  }

  // Show the selected post
  return (
    <section className="mb-8 p-5 rounded-lg border border-yellow-700" style={{ background: '#292524' }}>
      <h2 className="text-xl font-bold mb-4 !text-yellow-400 border-b border-yellow-800 pb-2">🏰 Preview</h2>

      <article>
        <h1 className="text-2xl font-bold text-yellow-50 mb-1">{post.title}</h1>
        <p className="text-sm text-stone-400 mt-1">
          Slug{' '}
          <code className="text-sm bg-stone-800 px-2 py-0.5 rounded text-sky-300 border border-stone-600">
            {slug ?? '—'}
          </code>
        </p>
        <p className="text-sm text-stone-300 mt-2">
          By <span className="text-sky-300">{post.author}</span> · Posted {formatDate(post.createdAt)}
          {post.status === 'published'
            ? ` · Published ${formatDate(post.publishedAt ?? post.updatedAt)}`
            : post.updatedAt !== post.createdAt
              ? ` · Updated ${formatDate(post.updatedAt)}`
              : ''}
          {' · '}
          {formatTime(readingTime(post.body))} to read ·{' '}
          <span
            className={`inline-block align-middle text-xs font-medium px-2 py-0.5 rounded border ${
              statusColorTok === 'green'
                ? 'bg-red-900 text-red-200 border-red-700'
                : statusColorTok === 'yellow'
                  ? 'bg-yellow-900 text-yellow-200 border-yellow-700'
                  : 'bg-stone-700 text-stone-300 border-stone-500'
            }`}
          >
            {statusLabel}
          </span>
        </p>

        <p className="mt-4 text-stone-300 leading-relaxed">{createExcerpt(post.body, 220)}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-sky-900 text-sky-200 border border-sky-700 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-stone-500">Category: {post.category}</p>
      </article>
    </section>
  )
}

export default Preview