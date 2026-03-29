import { useLocalStorage } from '../hooks/useLocalStorage'

export function useAppStore() {
  const [players, setPlayers] = useLocalStorage('badminton_players', [])
  const [matches, setMatches] = useLocalStorage('badminton_matches', [])

  function addPlayer(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    setPlayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, createdAt: new Date().toISOString() },
    ])
  }

  function deletePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  function saveMatch(match) {
    setMatches((prev) => [match, ...prev])
  }

  function deleteMatch(id) {
    setMatches((prev) => prev.filter((m) => m.id !== id))
  }

  function updateMatch(updated) {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
  }

  // Convenience: id → player map for lookups
  const playerMap = Object.fromEntries(players.map((p) => [p.id, p]))

  return { players, addPlayer, deletePlayer, matches, saveMatch, deleteMatch, updateMatch, playerMap }
}
