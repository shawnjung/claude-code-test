import { useState } from 'react'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top nav */}
        <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Page content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {activeTab === 'players' && <PlayersPage store={store} />}
          {activeTab === 'record' && <RecordPage store={store} onSaved={goToHistory} />}
          {activeTab === 'history' && <HistoryPage store={store} />}
        </main>
      </div>
    </div>
  )
}
