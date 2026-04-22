/**
 * Mirrors `postkit-storage-lib` (README API) until the published package ships a built `index.js`.
 * Keep in sync with: node_modules/postkit-storage-lib/src/types.ts
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

export function savePosts(key: string, posts: Post[]): void {
  localStorage.setItem(key, JSON.stringify(posts))
}

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
