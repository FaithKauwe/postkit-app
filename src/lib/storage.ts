import {
  loadPosts as loadPostsForKey,
  savePosts as savePostsForKey,
} from 'postkit-storage-lib'
import type { Post } from '../types'

/** Single app-wide localStorage key — components never pass keys into storage helpers. 
 * the key will be used to track if the visit is a first visit to the site or return. a check will be made if the key is null (hasn't been set before, no prior visit, no persistence)
 * vs if the key has a value (even an empty array) means persistence was used at least once
*/
export const POSTKIT_STORAGE_KEY = 'postkit.posts'

/** True if we have ever written to the posts key (including saving an empty list). */
export function hasSavedPostsBefore(): boolean {
  return localStorage.getItem(POSTKIT_STORAGE_KEY) !== null
}

// wrapper fucntion that grabs the posts from the shim, injects the key to obfuscate that step from callers
// and makes the posts available as the return of this function to any callers anywhere
export function loadPosts(): Post[] {
  return loadPostsForKey(POSTKIT_STORAGE_KEY) as Post[]
}

// wrapper function that saves new posts, it calls another function from the postkit-storage-lib that will convert the post object into
// JSOn objects to be stored in local storage
export function savePosts(posts: Post[]): void {
  savePostsForKey(POSTKIT_STORAGE_KEY, posts)
}
