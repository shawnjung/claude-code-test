/**
 * Read-only summary shown before saving.
 */
export default function MatchSummary({ homeLabel, awayLabel, games, winnerSide }) {
  const winnerLabel = winnerSide === 'home' ? homeLabel : winnerSide === 'away' ? awayLabel : null

  return (
    <div className="space-y-3">
      {/* Winner banner — only shown when a side has won 2 games */}
      {winnerLabel ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Winner</p>
          <p className="text-lg font-bold text-green-800">{winnerLabel}</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Incomplete Match</p>
          <p className="text-sm text-amber-700">Saving with {games.length} game{games.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Score breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span className="truncate">{homeLabel}</span>
          <span className="text-center">Game</span>
          <span className="text-right truncate">{awayLabel}</span>
        </div>
        {games.map((g) => (
          <div key={g.gameNumber} className="grid grid-cols-3 px-4 py-3 items-center">
            <span className={`text-lg font-bold ${g.winner === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}>
              {g.scores.home}
            </span>
            <span className="text-center text-xs text-gray-400">Game {g.gameNumber}</span>
            <span className={`text-lg font-bold text-right ${g.winner === 'away' ? 'text-indigo-600' : 'text-gray-400'}`}>
              {g.scores.away}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
