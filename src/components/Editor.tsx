import { usePostStore } from '../store/usePostStore'
import { useState, useEffect } from 'react'
import {
  getPostValidationErrors,
  type ValidationIssue,
} from 'postkit-validation-library'
import type { Post } from '../types'

/** First message per field from the library’s issues list (inline errors under inputs). */
function mapValidationIssuesToFields(
  issues: ValidationIssue[],
): Partial<Record<'title' | 'body' | 'status' | 'post', string>> {
  const out: Partial<Record<'title' | 'body' | 'status' | 'post', string>> = {}
  for (const issue of issues) {
    if (out[issue.field] === undefined) {
      out[issue.field] = issue.message
    }
  }
  return out
}

type FormShape = {
  title: string
  body: string
  author: string
  tags: string
  category: string
  status: string
}

/** Build the full `Post` the validation library expects (same shape as store / save). */
// candidate post now replaces "newPost" since the whole post object had to be built anyway to be validated
function buildCandidatePost(args: {
  formData: FormShape
  tagsArray: string[]
  now: string
  selectedPostId: string | null
  posts: Post[]
}): Post | null {
  const { formData, tagsArray, now, selectedPostId, posts } = args
  const status = formData.status as Post['status']

  if (selectedPostId === null) {
  // build a full new post object with all fields supplied by the user input from the form
    return {
      id: crypto.randomUUID(),  // crypto is a global object available in all modern browsers. guaranteed to be unique
      title: formData.title,
      body: formData.body,
      author: formData.author,
      tags: tagsArray,
      category: formData.category,
      status,
      createdAt: now,
      updatedAt: now,
    }
  }

  const existing = posts.find((p) => p.id === selectedPostId)
  if (!existing) return null

  return {
    ...existing,
    title: formData.title,
    body: formData.body,
    author: formData.author,
    tags: tagsArray,
    category: formData.category,
    status,
    updatedAt: now,
  }
}

function Editor() {
  // Get posts and selectedPostId from Zustand store. these don't get imported with other imports. they are part of the
  // usePostStore funciton, so only that one gets imported, then these all get assigned to local consts 
  const posts = usePostStore((state) => state.posts)
  const selectedPostId = usePostStore((state) => state.selectedPostId)
  const setSelectedPostId = usePostStore((state) => state.setSelectedPostId)
  const addPost = usePostStore((state) => state.addPost)
  const updatePost = usePostStore((state) => state.updatePost)


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

  /** Inline messages for title / body / status / whole-post validation (library field codes). */
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<'title' | 'body' | 'status' | 'post', string>>
  >({})

  const handleNewPost = () => {
    setSelectedPostId(null)  // reset the arg (which would have been a PostID number(string) from zustand store) to null since this is a blank post
    setFieldErrors({})
    setFormData({
      title: '',
      body: '',
      author: '',
      tags: '',
      category: '',
      status: 'draft',
    })
  }

  const handleSave = () => {
    // create timestamp
    const now = new Date().toISOString()
    // Convert tags string to array (split by comma, trim whitespace)
    const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter((t) => t)   
    
    const candidate = buildCandidatePost({
      formData,
      tagsArray,
      now,
      selectedPostId,
      posts,
    })
    // null check for candidate
    if (!candidate) {
      setFieldErrors({ post: 'Could not load the selected post to update.' })
      return
    }

    const issues = getPostValidationErrors(candidate)
    if (issues.length > 0) {
      setFieldErrors(mapValidationIssuesToFields(issues))
      return
    }
    setFieldErrors({})

    if (selectedPostId === null) {
      // call the addPost function from store which saves the post to the array of posts. use candidate as the arg. if candidate has
      // passed the validation checks, then it becomes the newPost by being saved to the posts array
      addPost(candidate)
      setSelectedPostId(candidate.id)  // set the id and highlight in the list, load in the editor (ui experience)
    } else {
      // update existing post, since the form fields shares one state, give all fields as args and replace the entire form, the changes will override any differeing originals
      updatePost(selectedPostId, {
        title: candidate.title,
        body: candidate.body,
        author: candidate.author,
        tags: candidate.tags,
        category: candidate.category,
        status: candidate.status,
        updatedAt: candidate.updatedAt,
      })
    }
  }
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

  useEffect(() => {
    setFieldErrors({})
  }, [selectedPostId])

  return (
        <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Editor</h2>

        <div className="flex gap-2 mb-4">
  <button 
    onClick={handleNewPost}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    New Post
  </button>
  <button 
    onClick={handleSave}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  >
    Save
  </button>
</div>

        {fieldErrors.post ? (
          <p className="text-red-600 text-sm mb-4" role="alert">
            {fieldErrors.post}
          </p>
        ) : null}
        {/* Title field */}
        <label className="block mb-4">
          <span className="text-gray-700">Title</span>
          {/* clear the title error msg after user starts fixing the field, where prev is the last object in fieldErrors that React passes */}
          <input
            id="editor-title"
            type="text"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value
              setFormData({ ...formData, title })
              setFieldErrors((prev) => {
                if (!prev.title) return prev
                const next = { ...prev }
                delete next.title
                return next
              })
            }}
            placeholder='e.g. “Tis But a Scratch”, The Rabbit of Caerbannog…'
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'editor-title-error' : undefined}
            className={`mt-1 block w-full border rounded p-2 ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {fieldErrors.title ? (
            <p id="editor-title-error" className="text-red-600 text-sm mt-1" role="alert">
              {fieldErrors.title}
            </p>
          ) : null}
        </label>
        {/* Author field */}
        <label className="block mb-4">
          <span className="text-gray-700">Author</span>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="e.g. Brave Sir Robin, Dennis the Constitutional Peasant…"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-4">
   {/* Body field */}
  <span className="text-gray-700">Body</span>
  <textarea
    id="editor-body"
    value={formData.body}
    onChange={(e) => {
      const body = e.target.value
      setFormData({ ...formData, body })
      setFieldErrors((prev) => {
        if (!prev.body) return prev
        const next = { ...prev }
        delete next.body
        return next
      })
    }}
    rows={6}
    placeholder="Spam, llamas, and the air-speed velocity of an unladen swallow—go on."
    aria-invalid={Boolean(fieldErrors.body)}
    aria-describedby={fieldErrors.body ? 'editor-body-error' : undefined}
    className={`mt-1 block w-full border rounded p-2 ${fieldErrors.body ? 'border-red-500' : 'border-gray-300'}`}
  />
  {fieldErrors.body ? (
    <p id="editor-body-error" className="text-red-600 text-sm mt-1" role="alert">
      {fieldErrors.body}
    </p>
  ) : null}
</label>
       {/* Tags field */}
       <label className="block mb-4">
          <span className="text-gray-700">Tags (comma-separated)</span>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="shrubbery, elderberries, comfy chair…"
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
            placeholder="e.g. Holy Grail, Spanish Inquisition sketch…"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        {/* Status field uses a dropdown menu for selection, only 3 choices*/}
<label className="block mb-4">
  <span className="text-gray-700">Status</span>
  <select
    id="editor-status"
    value={formData.status}
    onChange={(e) => {
      const status = e.target.value
      setFormData({ ...formData, status })
      setFieldErrors((prev) => {
        if (!prev.status) return prev
        const next = { ...prev }
        delete next.status
        return next
      })
    }}
    aria-invalid={Boolean(fieldErrors.status)}
    aria-describedby={fieldErrors.status ? 'editor-status-error' : undefined}
    className={`mt-1 block w-full border rounded p-2 ${fieldErrors.status ? 'border-red-500' : 'border-gray-300'}`}
  >
    <option value="draft">Draft</option>
    <option value="review">Review</option>
    <option value="published">Published</option>
  </select>
  {fieldErrors.status ? (
    <p id="editor-status-error" className="text-red-600 text-sm mt-1" role="alert">
      {fieldErrors.status}
    </p>
  ) : null}
</label>
      </section>
    )
}

export default Editor