import { usePostStore } from '../store/usePostStore'

function Preview() {
    return (
        <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <p className="text-gray-500">[Post preview will appear here]</p>
      </section>
    )
}

export default Preview