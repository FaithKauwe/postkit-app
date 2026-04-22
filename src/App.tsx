import MitchellSmokeReport from './mitchells-smoke-report'

function App() {
  // Mitchell's package smoke report: open dev server with ?smoke=1 (dev only)
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
      {/* YOUR TURN: Follow the pattern above to create this section */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        <p className="text-gray-500">[Posts will be listed here]</p>
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
