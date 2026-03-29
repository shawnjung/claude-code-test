import { useState } from 'react'
import PlayerSelector from './PlayerSelector'
import GameScoreInput from './GameScoreInput'
import MatchSummary from './MatchSummary'
import MatchCard from '../History/MatchCard'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { isValidGame, getGameWinner, getMatchWinner, isMatchComplete, formatTeam } from '../../utils/badminton'

const EMPTY_SCORE = { home: '0', away: '0' }

function toDatetimeLocal(date) {
  const d = new Date(date)
  // format as YYYY-MM-DDTHH:mm for <input type="datetime-local">
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function RecordPage({ store, onSaved }) {
  const { players, playerMap, saveMatch } = store

  const [step, setStep] = useState(1) // 1: setup, 2: scores, 3: confirm

  // Persisted: remember last selection across sessions
  const [matchType, setMatchType] = useLocalStorage('badminton_last_matchType', 'singles')
  const [homeIds, setHomeIds] = useLocalStorage('badminton_last_homeIds', [''])
  const [awayIds, setAwayIds] = useLocalStorage('badminton_last_awayIds', [''])

  const [scores, setScores] = useState([{ ...EMPTY_SCORE }])
  const [playedAt, setPlayedAt] = useState(() => toDatetimeLocal(new Date()))

  // --- derived ---
  const isDoubles = matchType === 'doubles'
  const requiredSlots = isDoubles ? 2 : 1

  // Validate saved IDs still exist in the current player list
  const validHomeIds = homeIds.map((id) => (playerMap[id] ? id : ''))
  const validAwayIds = awayIds.map((id) => (playerMap[id] ? id : ''))

  const homeReady = validHomeIds.slice(0, requiredSlots).every(Boolean)
  const awayReady = validAwayIds.slice(0, requiredSlots).every(Boolean)
  const canStart = homeReady && awayReady

  const homeLabel = formatTeam(validHomeIds.slice(0, requiredSlots).filter(Boolean), playerMap) || (isDoubles ? 'Home Team' : 'Home')
  const awayLabel = formatTeam(validAwayIds.slice(0, requiredSlots).filter(Boolean), playerMap) || (isDoubles ? 'Away Team' : 'Away')

  const completedGames = scores
    .filter((s) => isValidGame(s.home, s.away))
    .map((s, i) => ({
      gameNumber: i + 1,
      scores: { home: Number(s.home), away: Number(s.away) },
      winner: getGameWinner(s.home, s.away),
    }))

  const matchComplete = isMatchComplete(completedGames)
  const matchWinner = getMatchWinner(completedGames)

  const currentGameIndex = scores.length - 1
  const currentGameValid = isValidGame(scores[currentGameIndex]?.home, scores[currentGameIndex]?.away)
  const canAddGame = currentGameValid && !matchComplete && scores.length < 3

  // --- handlers ---
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

  function handleSave() {
    const match = {
      id: crypto.randomUUID(),
      playedAt: new Date(playedAt).toISOString(),
      matchType,
      players: {
        home: validHomeIds.slice(0, requiredSlots).filter(Boolean),
        away: validAwayIds.slice(0, requiredSlots).filter(Boolean),
      },
      games: completedGames,
      winner: matchWinner,
    }
    saveMatch(match)
    onSaved()
  }

  function handleGoToConfirm() {
    setPlayedAt(toDatetimeLocal(new Date())) // reset to now each time entering confirm
    setStep(3)
  }

  function handleReset() {
    setStep(1)
    setScores([{ ...EMPTY_SCORE }])
  }

  const { matches } = store
  const recentMatches = matches.slice(0, 6)

  if (players.length < 2) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">👥</div>
        <p className="font-medium text-gray-600">Need at least 2 players</p>
        <p className="text-sm mt-1">Go to the Players tab to add players first.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-8 items-start">
      {/* ── Left: form ── */}
      <div className="flex-1 min-w-0 space-y-4 max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Record Match</h1>
        {step > 1 && (
          <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Start over
          </button>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step > s ? 'bg-indigo-600 text-white' : step === s ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`flex-1 h-px w-8 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-1">
          {step === 1 ? 'Setup' : step === 2 ? 'Scores' : 'Confirm'}
        </span>
      </div>

      {/* Step 1: Setup */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Match type toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Match Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['singles', 'doubles'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleMatchTypeChange(type)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${
                    matchType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Player selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <PlayerSelector
              players={players}
              matchType={matchType}
              homeIds={validHomeIds}
              awayIds={validAwayIds}
              onHomeChange={setHomeIds}
              onAwayChange={setAwayIds}
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canStart}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Match →
          </button>
        </div>
      )}

      {/* Step 2: Score entry */}
      {step === 2 && (
        <div className="space-y-3">
          {scores.map((s, i) => (
            <GameScoreInput
              key={i}
              gameNumber={i + 1}
              homeScore={s.home}
              awayScore={s.away}
              homeLabel={homeLabel}
              awayLabel={awayLabel}
              onChange={(val) => handleScoreChange(i, val)}
              readOnly={i < scores.length - 1}
            />
          ))}

          {canAddGame && (
            <button
              onClick={handleAddGame}
              className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-sm font-medium hover:border-indigo-400 hover:text-indigo-500 transition-colors"
            >
              + Add Game {scores.length + 1}
            </button>
          )}

          {completedGames.length >= 1 && (
            <button
              onClick={handleGoToConfirm}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Review & Save →
            </button>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <MatchSummary
            homeLabel={homeLabel}
            awayLabel={awayLabel}
            games={completedGames}
            winnerSide={matchWinner}
          />

          {/* Date & time picker */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1.5">
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

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Save Match
            </button>
          </div>
        </div>
      )}
      </div>{/* end left column */}

      {/* ── Right: recent matches (desktop only) ── */}
      <aside className="hidden lg:block w-72 flex-shrink-0 space-y-4 sticky top-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Recent Matches</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last {recentMatches.length} recorded</p>
        </div>
        {recentMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
            <p className="text-sm">No matches yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                playerMap={playerMap}
                onDelete={store.deleteMatch}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
