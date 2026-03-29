const TABS = [
  {
    id: 'players',
    label: 'Players',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.874M9 20H4v-2a4 4 0 015-3.874m6 5.874a4 4 0 10-8 0m12-8a4 4 0 10-8 0 4 4 0 008 0z" />
      </svg>
    ),
  },
  {
    id: 'record',
    label: 'Record Match',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 sticky top-0 h-screen flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-indigo-600 tracking-tight">🏸 Badminton</span>
        <p className="text-xs text-gray-400 mt-0.5">Score Recorder</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-300">BWF rules · Best of 3</p>
      </div>
    </aside>
  )
}
