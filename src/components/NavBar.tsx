type View = 'home' | 'send' | 'activity' | 'settings'

interface NavBarProps {
  currentView: View
  onNavigate: (view: View) => void
}

export function NavBar({ currentView, onNavigate }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button
        className={`nav-item ${currentView === 'send' ? 'active' : ''}`}
        onClick={() => onNavigate('send')}
      >
        <span className="nav-icon">↑</span>
        <span className="nav-label">Send</span>
      </button>

      <button
        className={`nav-item ${currentView === 'activity' ? 'active' : ''}`}
        onClick={() => onNavigate('activity')}
      >
        <span className="nav-icon">📋</span>
        <span className="nav-label">Activity</span>
      </button>

      <button
        className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <span className="nav-icon">⚙️</span>
        <span className="nav-label">Settings</span>
      </button>
    </nav>
  )
}
