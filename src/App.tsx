import MitchellSmokeReport from './mitchells-smoke-report'
import PostList from './components/PostList'
import Editor from './components/Editor'
import Preview from './components/Preview'





// React only works with the JS family of languages: no ruby, python etc
function App() {
  // State notes (kept for learning):
  // - useState returns [currentValue, setterFunction]
  // - We now use Zustand instead of useState for shared state
  // - Zustand lets any component import state directly (no prop drilling)
  // Mitchell's package smoke report: open dev server with ?smoke=1 (dev only)
  // look into reacter router wrapper provider that will hide some components and display others
  // it will look like a multi page app but will actually be a single page app and the urls are conficgurable 
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('smoke') === '1') {
    return <MitchellSmokeReport />
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#1C1917' }}>
      {/* ===== SECTION 1: HEADER ===== */}
      <header className="mb-8 border-b-4 border-yellow-600 pb-4">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#EAB308' }}>⚔️ PostKit</h1>
        <p style={{ color: '#7DD3FC' }} className="text-sm mt-1 font-medium">We are the knights who say… publish.</p>
      </header>

      {/* ===== SECTION 2: POST LIST (+ search / filter in PostList) ===== */}
      <PostList />

      {/* ===== SECTION 3: EDITOR ===== */}
      <Editor />

      {/* ===== SECTION 4: PREVIEW ===== */}
      <Preview />
    </div>
  )
}

export default App
