import { usePostStore } from '../store/usePostStore'
import { formatDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { searchPosts } from 'postkit-search-library'

function PostList() {
  const posts = usePostStore((state) => state.posts)
  const searchQuery = usePostStore((state) => state.searchQuery)
  const setSearchQuery = usePostStore((state) => state.setSearchQuery)
  const selectedPostId = usePostStore((state) => state.selectedPostId)
  const setSelectedPostId = usePostStore((state) => state.setSelectedPostId)

  const visiblePosts = searchPosts(posts, searchQuery)

  return (
    <section className="mb-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>

      <label className="block mb-4">
        <span className="text-gray-700 text-sm">Search</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts…"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          aria-label="Search posts"
        />
      </label>

      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {posts.length === 0 ? 'No posts yet.' : 'No posts match your search.'}
          </p>
        ) : (
          visiblePosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPostId(post.id)}
              className={`p-4 border rounded cursor-pointer ${
                selectedPostId === post.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{post.title}</h3>
                <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-600">
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">by {post.author}</p>
              <p className="text-xs text-gray-500 mt-1">created at {formatDate(post.createdAt)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTime(readingTime(post.body))} to read</p>
              <div className="mt-2 flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default PostList
