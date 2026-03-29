export default function PlayerCard({ player, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
        {player.name.charAt(0).toUpperCase()}
      </div>
      <span className="flex-1 font-medium text-gray-900 truncate">{player.name}</span>
      <button
        onClick={() => onDelete(player.id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
        title="Delete player"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
