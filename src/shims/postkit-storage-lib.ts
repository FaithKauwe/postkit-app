/**
 * Local storage utility for PostKit.
 * 
 * This is a "shim" — it stands in for the broken `postkit-storage-lib` npm package.
 * Any import from 'postkit-storage-lib' gets redirected here by Vite (see vite.config.ts).
 * this file provides the actual functions (savePosts, loadPosts, etc.) that read/write to localStorage
 * 
 * Uses browser localStorage API:
 * - Data persists even after page refresh or browser close
 * - Stores strings only, so we JSON.stringify/parse our Post arrays
 * - ~5MB limit per domain (plenty for this app)
 */
export type PostStatus = 'draft' | 'review' | 'published'

export type Post = {
  id: string
  title: string
  body: string
  author: string
  tags: string[]
  category: string
  status: PostStatus
  createdAt: string
  updatedAt: string
}

// this function will get used by the wrapper method in storage.ts. it converts the post objects to JSON strings to store in the shim
export function savePosts(key: string, posts: Post[]): void {
  localStorage.setItem(key, JSON.stringify(posts))
}

// this function will get used by the wrapper method in storage.ts. it parses the json objects into post objects that match the Post type and can be used by the rest of the app
export function loadPosts(key: string): Post[] {
  const data = localStorage.getItem(key)
  if (!data) return []
  return JSON.parse(data) as Post[]
}

export function exportPosts(posts: Post[]): string {
  return JSON.stringify(posts, null, 2)
}

export function importPosts(json: string): Post[] {
  const parsed = JSON.parse(json)
  if (!Array.isArray(parsed)) throw new Error('Invalid format')
  return parsed as Post[]
}
