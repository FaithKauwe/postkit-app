import { useState } from 'react'
import MitchellSmokeReport from './mitchells-smoke-report'
import type { Post } from './types'
import { formatDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'




// Sample posts for development — Monty Python themed!
const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    title: 'Tis But a Scratch',
    body: 'The Black Knight always triumphs! Have at you! Come on, you pansy! I\'ll bite your legs off!',
    author: 'The Black Knight',
    tags: ['combat', 'denial', 'flesh-wound'],
    category: 'Holy Grail',
    status: 'published',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'On Second Thought, Let\'s Not Go to Camelot',
    body: 'It is a silly place. We eat ham and jam and spam a lot.',
    author: 'King Arthur',
    tags: ['camelot', 'silly', 'musical'],
    category: 'Holy Grail',
    status: 'draft',
    createdAt: '2024-02-20T14:30:00.000Z',
    updatedAt: '2024-02-21T09:15:00.000Z',
  },
  {
    id: '3',
    title: 'Nobody Expects the Spanish Inquisition',
    body: 'Our chief weapon is surprise! Surprise and fear. Fear and surprise. Our two weapons are fear and surprise and ruthless efficiency.',
    author: 'Cardinal Ximénez',
    tags: ['surprise', 'inquisition', 'comfy-chair'],
    category: 'Flying Circus',
    status: 'review',
    createdAt: '2024-03-10T08:00:00.000Z',
    updatedAt: '2024-03-12T16:45:00.000Z',
  },
]

// React only works with the JS family of languages: no ruby, python etc
function App() {
  // useState is the React function that creates state, it returns an array with 2 things: the curent value, in this case posts
  // and a function to update it: setPosts. posts (array) only has one shared state for the whole array, not each post having it's own state
  // share state between components using props, which can get messy, but mitchell recommends a global state library: redux toolkit (more complex but more pro), zustand (mitchell's choice), 
  // or react context (built into react, best for values that don't change often)
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS)

  // the arg for useState starts at null bc when the app first loads, no post has been selected
  // an onClick will be added to each card and then that will update that arg from null to a real num
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  
  // Mitchell's package smoke report: open dev server with ?smoke=1 (dev only)
  // look into reacter router wrapper provider that will hide some components and display others
  // it will look like a multi page app but will actually be a single page app and the urls are conficgurable 
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('smoke') === '1') {
    return <MitchellSmokeReport />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ===== SECTION 1: HEADER ===== */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PostKit</h1>
        <p className="text-gray-600">Manage your posts from draft to published</p>
      </header>

      {/* ===== SECTION 2: CONTROLS (search, filter, sort) ===== */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <p className="text-gray-500">[Search, filter, and sort controls will go here]</p>
      </section>

      {/* ===== SECTION 3: POST LIST ===== */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        
        {/* Loop through posts component created by useState function and render each one */}
        <div className="space-y-4">
          {posts.map((post) => (
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
              <p className="text-xs text-gray-500 mt-1"> {formatTime(readingTime(post.body))} to read </p>
              <div className="mt-2 flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 4: EDITOR ===== */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Editor</h2>
        <p className="text-gray-500">[Form to create and edit posts]</p>
      </section>

      {/* ===== SECTION 5: PREVIEW ===== */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <p className="text-gray-500">[Post preview will appear here]</p>
      </section>
    </div>
  )
}

export default App
