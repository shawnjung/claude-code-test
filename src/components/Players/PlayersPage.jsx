import { useState } from 'react'
import PlayerCard from './PlayerCard'
import AddPlayerModal from './AddPlayerModal'

export default function PlayersPage({ store }) {
  const { players, addPlayer, deletePlayer } = store
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Players</h1>
          <p className="text-sm text-gray-500">{players.length} registered</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Player
        </button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🏸</div>
          <p className="font-medium text-gray-600">No players yet</p>
          <p className="text-sm mt-1">Add players to start recording matches.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} onDelete={deletePlayer} />
          ))}
        </div>
      )}

      {showModal && (
        <AddPlayerModal
          players={players}
          onAdd={addPlayer}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
