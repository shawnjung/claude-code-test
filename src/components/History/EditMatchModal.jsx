import { useState } from 'react'
import PlayerSelector from '../Record/PlayerSelector'
import GameScoreInput from '../Record/GameScoreInput'
import { isValidGame, getGameWinner, getMatchWinner, formatTeam } from '../../utils/badminton'

const EMPTY_SCORE = { home: '0', away: '0' }

function toDatetimeLocal(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditMatchModal({ match, players, playerMap, onSave, onClose }) {
  const [matchType, setMatchType] = useState(match.matchType ?? 'singles')
  const [homeIds, setHomeIds] = useState(match.players.home)
  const [awayIds, setAwayIds] = useState(match.players.away)
  const [scores, setScores] = useState(
    match.games.map((g) => ({ home: String(g.scores.home), away: String(g.scores.away) }))
  )
  const [playedAt, setPlayedAt] = useState(toDatetimeLocal(match.playedAt))

  const isDoubles = matchType === 'doubles'
  const requiredSlots = isDoubles ? 2 : 1

  const validHomeIds = homeIds.map((id) => (playerMap[id] ? id : ''))
  const validAwayIds = awayIds.map((id) => (playerMap[id] ? id : ''))

  const homeReady = validHomeIds.slice(0, requiredSlots).every(Boolean)
  const awayReady = validAwayIds.slice(0, requiredSlots).every(Boolean)

  const homeLabel = formatTeam(validHomeIds.slice(0, requiredSlots).filter(Boolean), playerMap) || 'Home'
  const awayLabel = formatTeam(validAwayIds.slice(0, requiredSlots).filter(Boolean), playerMap) || 'Away'

  const completedGames = scores
    .filter((s) => isValidGame(s.home, s.away))
    .map((s, i) => ({
      gameNumber: i + 1,
      scores: { home: Number(s.home), away: Number(s.away) },
      winner: getGameWinner(s.home, s.away),
    }))

  const lastGameValid = isValidGame(scores[scores.length - 1]?.home, scores[scores.length - 1]?.away)
  const matchComplete = completedGames.length >= 2 && getMatchWinner(completedGames) !== null
  const canAddGame = lastGameValid && !matchComplete && scores.length < 3
  const canSave = homeReady && awayReady && completedGames.length >= 1

  function handleMatchTypeChange(type) {
    setMatchType(type)
    setHomeIds([''])
    setAwayIds([''])
  }

  function handleScoreChange(index, value) {
    setScores((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleAddGame() {
    if (!canAddGame) return
    setScores((prev) => [...prev, { ...EMPTY_SCORE }])
  }

  function handleRemoveLastGame() {
    if (scores.length <= 1) return
    setScores((prev) => prev.slice(0, -1))
  }

  function handleSave() {
    const updated = {
      ...match,
      playedAt: new Date(playedAt).toISOString(),
      matchType,
      players: {
        home: validHomeIds.slice(0, requiredSlots).filter(Boolean),
        away: validAwayIds.slice(0, requiredSlots).filter(Boolean),
      },
      games: completedGames,
      winner: getMatchWinner(completedGames),
    }
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Edit Match</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Match type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Match Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['singles', 'doubles'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleMatchTypeChange(type)}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                    matchType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Players */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <PlayerSelector
              players={players}
              matchType={matchType}
              homeIds={validHomeIds}
              awayIds={validAwayIds}
              onHomeChange={setHomeIds}
              onAwayChange={setAwayIds}
            />
          </div>

          {/* Game scores */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Game Scores</label>
              {scores.length > 1 && (
                <button
                  onClick={handleRemoveLastGame}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove last game
                </button>
              )}
            </div>
            {scores.map((s, i) => (
              <GameScoreInput
                key={i}
                gameNumber={i + 1}
                homeScore={s.home}
                awayScore={s.away}
                homeLabel={homeLabel}
                awayLabel={awayLabel}
                onChange={(val) => handleScoreChange(i, val)}
                readOnly={false}
              />
            ))}
            {canAddGame && (
              <button
                onClick={handleAddGame}
                className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-sm font-medium hover:border-indigo-400 hover:text-indigo-500 transition-colors"
              >
                + Add Game {scores.length + 1}
              </button>
            )}
          </div>

          {/* Date & time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Date &amp; Time Played
            </label>
            <input
              type="datetime-local"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
