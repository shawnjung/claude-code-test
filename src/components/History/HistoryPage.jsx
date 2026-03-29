import MatchCard from './MatchCard'

export default function HistoryPage({ store }) {
  const { matches, deleteMatch, playerMap } = store

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-500">{matches.length} match{matches.length !== 1 ? 'es' : ''} recorded</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-gray-600">No matches yet</p>
          <p className="text-sm mt-1">Record a match to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              playerMap={playerMap}
              onDelete={deleteMatch}
            />
          ))}
        </div>
      )}
    </div>
  )
}
