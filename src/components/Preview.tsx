import { usePostStore } from '../store/usePostStore'
import { formatDate } from 'postkit-date-status-display'

function Preview() {
  const posts = usePostStore((state) => state.posts)
  const selectedPostId = usePostStore((state) => state.selectedPostId)
  
  // use built in JS method find()to match the selectedPostId in the array of posts
  const post = posts.find((p) => p.id === selectedPostId)

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
        <p className="text-sm text-gray-500">
          By {post.author} · {formatDate(post.createdAt)} · {post.status}
        </p>
        
        <div className="mt-4 text-gray-700 whitespace-pre-wrap">{post.body}</div>
        
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