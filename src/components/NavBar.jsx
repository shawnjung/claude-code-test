const TABS = [
  { id: 'players', label: 'Players' },
  { id: 'record', label: 'Record Match' },
  { id: 'history', label: 'History' },
]

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-1 h-14">
          <span className="text-lg font-bold text-indigo-600 mr-auto tracking-tight">
            🏸 Badminton
          </span>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
