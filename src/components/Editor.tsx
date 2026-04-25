import { usePostStore } from '../store/usePostStore'
import { useState, useEffect } from 'react'

function Editor() {
  // Get posts and selectedPostId from Zustand store
  const posts = usePostStore((state) => state.posts)
  const selectedPostId = usePostStore((state) => state.selectedPostId)

  // formData is the name of the object and setFormData is the function to update it
  // the object inside is the initial value — all empty strings, status defaults to 'draft'
  // I have just one form object with all the fields sharing the same state, i will use the ... spread operator
  // to copy the whole form each time any field is changed and then override just that field with the new change
  // rather than making 6 separate states
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    author: '',
    tags: '',      // we'll store as string, split into array on save
    category: '',
    status: 'draft',
  })

  // useEffect is a react hook that detects a change- runs when selectedPostId changes
  // finds the selected post and copies its data into the form
  useEffect(() => {
    if (selectedPostId) {
      // Find the post with the matching ID, p is the iterating variable
      const post = posts.find((p) => p.id === selectedPostId)
      if (post) {
        // Copy post data into form (tags array converts to comma sep string)
        setFormData({
          title: post.title,
          body: post.body,
          author: post.author,
          tags: post.tags.join(', '),  // convert array back to string for editing
          category: post.category,
          status: post.status,
        })
      }
    }
  }, [selectedPostId, posts])  // re-run when these values change
  return (
        <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Editor</h2>
        {/* Title field */}
        <label className="block mb-4">
          <span className="text-gray-700">Title</span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        {/* Author field */}
        <label className="block mb-4">
          <span className="text-gray-700">Author</span>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-4">
   {/* Body field */}
  <span className="text-gray-700">Body</span>
  <textarea
    value={formData.body}
    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
    rows={6}
    className="mt-1 block w-full border border-gray-300 rounded p-2"
  />
</label>
       {/* Tags field */}
       <label className="block mb-4">
          <span className="text-gray-700">Tags (comma-separated)</span>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        {/* Category field */}
        <label className="block mb-4">
          <span className="text-gray-700">Category</span>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        {/* Status field uses a dropdown menu for selection, only 3 choices*/}
<label className="block mb-4">
  <span className="text-gray-700">Status</span>
  <select
    value={formData.status}
    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
    className="mt-1 block w-full border border-gray-300 rounded p-2"
  >
    <option value="draft">Draft</option>
    <option value="review">Review</option>
    <option value="published">Published</option>
  </select>
</label>
      </section>
    )
}

export default Editor