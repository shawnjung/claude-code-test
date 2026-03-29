/**
 * Returns true if the game scores represent a completed, valid game.
 * BWF rules: first to 21 with 2-point lead; max 30 (30-29 ends it).
 */
export function isValidGame(homeScore, awayScore) {
  const h = Number(homeScore)
  const a = Number(awayScore)
  if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return false
  if (h > 30 || a > 30) return false
  if (h === 30) return a === 29
  if (a === 30) return h === 29
  const winner = h >= 21 ? h : a >= 21 ? a : null
  if (!winner) return false
  return Math.abs(h - a) >= 2
}

/**
 * Returns 'home' | 'away' | null for a completed game.
 */
export function getGameWinner(homeScore, awayScore) {
  if (!isValidGame(homeScore, awayScore)) return null
  return Number(homeScore) > Number(awayScore) ? 'home' : 'away'
}

/**
 * Given an array of completed games, returns 'home' | 'away' | null.
 * First side to win 2 games wins the match.
 */
export function getMatchWinner(games) {
  let homeWins = 0
  let awayWins = 0
  for (const game of games) {
    if (game.winner === 'home') homeWins++
    else if (game.winner === 'away') awayWins++
    if (homeWins === 2) return 'home'
    if (awayWins === 2) return 'away'
  }
  return null
}

/**
 * Returns true when a side has clinched 2 game wins.
 */
export function isMatchComplete(games) {
  return getMatchWinner(games) !== null
}

/**
 * Format a team label for display.
 * @param {string[]} playerIds - array of 1 or 2 player IDs
 * @param {Object} playerMap - id → player object
 */
export function formatTeam(playerIds, playerMap) {
  return playerIds
    .map((id) => playerMap[id]?.name ?? 'Deleted Player')
    .join(' & ')
}
