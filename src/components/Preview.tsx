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
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <p className="text-gray-500">Select a post to preview it here</p>
      </section>
    )
  }

  // Show the selected post
  return (
    <section className="mb-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>
      
      <article className="prose">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Slug{' '}
          <code className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-900">
            {slug ?? '—'}
          </code>
        </p>
        <p className="text-sm text-gray-500">
          By {post.author} · Posted {formatDate(post.createdAt)}
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
                ? 'bg-green-50 text-green-900 border-green-300'
                : statusColorTok === 'yellow'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
          >
            {statusLabel}
          </span>
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">{createExcerpt(post.body, 220)}</p>
        
        <div className="mt-4 flex gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <p className="mt-4 text-xs text-gray-400">Category: {post.category}</p>
      </article>
    </section>
  )
}

export default Preview