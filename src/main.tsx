import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { hasSavedPostsBefore, loadPosts, savePosts } from './lib/storage'
import { usePostStore } from './store/usePostStore'
import App from './App.tsx'

// check once on initializing the app (why it's in main) if the browser has saved posts before
// load posts once, on init
if (hasSavedPostsBefore()) {
  usePostStore.setState({ posts: loadPosts(), selectedPostId: null })
}
// subscribe is a zustand API call (to the zustand store object that lives in memory) every state update and compares the new posts value in the store object to the old posts value
// then persist the changes (save them) to local storage
usePostStore.subscribe((state, prevState) => {
  if (state.posts !== prevState.posts) {
    savePosts(state.posts)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
