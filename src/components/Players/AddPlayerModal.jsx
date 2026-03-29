import { useState } from 'react'

export default function AddPlayerModal({ players, onAdd, onClose }) {
  const [name, setName] = useState('')

  const isDuplicate = players.some(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase()
  )
  const isValid = name.trim().length > 0 && !isDuplicate

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    onAdd(name)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Player</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player name"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            />
            {isDuplicate && (
              <p className="text-red-500 text-xs mt-1">A player with this name already exists.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
