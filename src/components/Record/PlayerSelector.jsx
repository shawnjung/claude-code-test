/**
 * Renders a team selector for either 'singles' or 'doubles'.
 * For doubles, two player dropdowns are shown per side.
 *
 * Props:
 *   players        - full player list
 *   matchType      - 'singles' | 'doubles'
 *   homeIds        - string[]
 *   awayIds        - string[]
 *   onHomeChange   - (ids: string[]) => void
 *   onAwayChange   - (ids: string[]) => void
 */
export default function PlayerSelector({ players, matchType, homeIds, awayIds, onHomeChange, onAwayChange }) {
  const isDoubles = matchType === 'doubles'
  const slots = isDoubles ? [0, 1] : [0]

  function setHome(index, value) {
    const next = [...homeIds]
    next[index] = value
    onHomeChange(next)
  }

  function setAway(index, value) {
    const next = [...awayIds]
    next[index] = value
    onAwayChange(next)
  }

  // All selected IDs to prevent picking same player twice in doubles
  const allSelected = [...homeIds, ...awayIds].filter(Boolean)

  function availableFor(side, index) {
    const others = allSelected.filter((id) => {
      if (side === 'home') return id !== homeIds[index]
      return id !== awayIds[index]
    })
    return players.filter((p) => !others.includes(p.id))
  }

  return (
    <div className="space-y-4">
      {/* Home team */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {isDoubles ? 'Home Team' : 'Home Player'}
        </label>
        {slots.map((i) => (
          <select
            key={i}
            value={homeIds[i] ?? ''}
            onChange={(e) => setHome(i, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 appearance-none"
          >
            <option value="">Select player{isDoubles ? ` ${i + 1}` : ''}…</option>
            {availableFor('home', i).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">vs</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Away team */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {isDoubles ? 'Away Team' : 'Away Player'}
        </label>
        {slots.map((i) => (
          <select
            key={i}
            value={awayIds[i] ?? ''}
            onChange={(e) => setAway(i, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 appearance-none"
          >
            <option value="">Select player{isDoubles ? ` ${i + 1}` : ''}…</option>
            {availableFor('away', i).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  )
}
