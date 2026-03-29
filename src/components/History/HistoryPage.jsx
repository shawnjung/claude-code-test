import MatchCard from './MatchCard'

export default function HistoryPage({ store }) {
  const { matches, deleteMatch, playerMap } = store

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {matches.length} match{matches.length !== 1 ? 'es' : ''} recorded
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="font-medium text-gray-600 text-lg">No matches yet</p>
          <p className="text-sm mt-1">Record a match to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
