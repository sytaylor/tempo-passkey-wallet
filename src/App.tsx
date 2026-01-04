import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Auth } from './components/Auth'
import { Home } from './components/Home'
import { Send } from './components/Send'
import { Activity } from './components/Activity'
import { Settings } from './components/Settings'
import { NavBar } from './components/NavBar'
import './styles.css'

type View = 'home' | 'send' | 'activity' | 'settings'

export function App() {
  const { address, isConnected } = useAccount()
  const [currentView, setCurrentView] = useState<View>('home')

  if (!isConnected) {
    return <Auth />
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {currentView === 'home' && <Home address={address!} onNavigate={setCurrentView} />}
        {currentView === 'send' && <Send address={address!} onBack={() => setCurrentView('home')} />}
        {currentView === 'activity' && <Activity address={address!} onBack={() => setCurrentView('home')} />}
        {currentView === 'settings' && <Settings onBack={() => setCurrentView('home')} />}
      </div>
      <NavBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  )
}
