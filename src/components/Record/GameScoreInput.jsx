import { isValidGame } from '../../utils/badminton'

/**
 * A single game score row.
 *
 * Props:
 *   gameNumber  - 1 | 2 | 3
 *   homeScore   - string
 *   awayScore   - string
 *   homeLabel   - string (team display name)
 *   awayLabel   - string
 *   onChange    - ({ home, away }) => void
 *   readOnly    - boolean
 */
export default function GameScoreInput({ gameNumber, homeScore, awayScore, homeLabel, awayLabel, onChange, readOnly }) {
  const valid = isValidGame(homeScore, awayScore)

  function handleChange(side, raw) {
    const clamped = Math.min(30, Math.max(0, parseInt(raw) || 0))
    onChange(side === 'home' ? { home: String(clamped), away: awayScore } : { home: homeScore, away: String(clamped) })
  }

  return (
    <div className={`bg-white rounded-2xl border p-4 transition-colors ${valid ? 'border-green-300 bg-green-50/30' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Game {gameNumber}</span>
        {valid && (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Valid</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1.5 truncate">{homeLabel}</p>
          <input
            type="number"
            min="0"
            max="30"
            value={homeScore}
            onChange={(e) => handleChange('home', e.target.value)}
            disabled={readOnly}
            className="w-full text-center text-2xl font-bold py-2 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <span className="text-gray-300 font-light text-xl">—</span>
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1.5 truncate">{awayLabel}</p>
          <input
            type="number"
            min="0"
            max="30"
            value={awayScore}
            onChange={(e) => handleChange('away', e.target.value)}
            disabled={readOnly}
            className="w-full text-center text-2xl font-bold py-2 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  )
}
