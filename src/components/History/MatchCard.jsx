import { formatTeam } from '../../utils/badminton'

export default function MatchCard({ match, playerMap, onDelete, onEdit }) {
  const { matchType, players, games, winner, playedAt } = match
  const isDoubles = matchType === 'doubles'

  const homeLabel = formatTeam(players.home, playerMap)
  const awayLabel = formatTeam(players.away, playerMap)
  const winnerLabel = winner === 'home' ? homeLabel : awayLabel

  const scoreString = games
    .map((g) => `${g.scores.home}-${g.scores.away}`)
    .join(', ')

  const date = new Date(playedAt)
  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Header: date + type + delete */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{dateStr} · {timeStr}</span>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
            {isDoubles ? 'Doubles' : 'Singles'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(match)}
              className="text-gray-300 hover:text-indigo-500 transition-colors p-1 rounded-lg hover:bg-indigo-50"
              title="Edit match"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(match.id)}
            className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
            title="Delete match"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${winner === 'home' ? 'text-indigo-600' : 'text-gray-700'}`}>
            {homeLabel}
            {winner === 'home' && <span className="ml-1 text-xs">🏆</span>}
          </p>
        </div>
        <span className="text-xs text-gray-300 font-medium flex-shrink-0">vs</span>
        <div className="flex-1 min-w-0 text-right">
          <p className={`font-semibold text-sm truncate ${winner === 'away' ? 'text-indigo-600' : 'text-gray-700'}`}>
            {winner === 'away' && <span className="mr-1 text-xs">🏆</span>}
            {awayLabel}
          </p>
        </div>
      </div>

      {/* Game scores */}
      <div className="flex gap-1.5 flex-wrap">
        {games.map((g) => (
          <div key={g.gameNumber} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2.5 py-1">
            <span className={`text-sm font-bold ${g.winner === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}>
              {g.scores.home}
            </span>
            <span className="text-gray-300 text-xs">—</span>
            <span className={`text-sm font-bold ${g.winner === 'away' ? 'text-indigo-600' : 'text-gray-500'}`}>
              {g.scores.away}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
