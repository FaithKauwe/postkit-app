import { create } from 'zustand'
import type { Post } from '../types'

// zustand store lives in browser memory and is gone when the page is refreshed


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

// Shape of the store: what data it holds + what actions it exposes
type PostStore = {
  // STATE
  posts: Post[]
  selectedPostId: string | null

  // ACTIONS
  setSelectedPostId: (id: string | null) => void
  addPost: (post: Post) => void
  updatePost: (id: string, changes: Partial<Post>) => void
  deletePost: (id: string) => void
}

// create() builds the store. The function receives `set` which lets you update state.
export const usePostStore = create<PostStore>((set) => ({
  // Initial state
  posts: SAMPLE_POSTS,
  selectedPostId: null,

  // Action: set selectedPostId to the given id (or null to deselect)
  setSelectedPostId: (id) => set({ selectedPostId: id }),

  // Action: add a new post to the array
  addPost: (post) =>
    set((state) => ({
      posts: [...state.posts, post],
    })),

  // Action: update one post by id. Partial<Post> means "any subset of Post fields"
  updatePost: (id, changes) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...changes } : p
      ),
    })),

  // Action: remove a post by id
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      // Also clear selection if the deleted post was selected
      selectedPostId: state.selectedPostId === id ? null : state.selectedPostId,
    })),
}))
