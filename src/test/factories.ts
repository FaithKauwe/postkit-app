import type { Post } from '../types'

let counter = 0

export function makePost(overrides: Partial<Post> = {}): Post {
  counter++
  return {
    id: `post-${counter}`,
    title: `Test Post ${counter}`,
    body: 'Body text.',
    author: 'Test Author',
    tags: ['test'],
    category: 'General',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}