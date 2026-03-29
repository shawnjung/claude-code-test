import { useState } from 'react'
import NavBar from './components/NavBar'
import PlayersPage from './components/Players/PlayersPage'
import RecordPage from './components/Record/RecordPage'
import HistoryPage from './components/History/HistoryPage'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const [activeTab, setActiveTab] = useState('players')
  const store = useAppStore()

  function goToHistory() {
    setActiveTab('history')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-lg mx-auto px-4 py-6">
        {activeTab === 'players' && <PlayersPage store={store} />}
        {activeTab === 'record' && <RecordPage store={store} onSaved={goToHistory} />}
        {activeTab === 'history' && <HistoryPage store={store} />}
      </main>
    </div>
  )
}
