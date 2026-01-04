import { useDisconnect } from 'wagmi'

interface SettingsProps {
  onBack: () => void
}

export function Settings({ onBack }: SettingsProps) {
  const { disconnect } = useDisconnect()

  const handleSignOut = () => {
    disconnect()
  }

  return (
    <div>
      <div className="header">
        <button className="header-back" onClick={onBack}>
          ← Back
        </button>
        <span className="header-title">Settings</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Network</span>
        </div>
        
        <div className="settings-item" style={{ cursor: 'default' }}>
          <div className="settings-item-left">
            <div className="settings-icon">⚡</div>
            <span className="settings-label">Tempo Testnet</span>
          </div>
          <span className="testnet-badge" style={{ fontSize: 11 }}>Testnet</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Resources</span>
        </div>
        
        <div 
          className="settings-item"
          onClick={() => window.open('https://docs.tempo.xyz', '_blank')}
        >
          <div className="settings-item-left">
            <div className="settings-icon">📚</div>
            <span className="settings-label">Documentation</span>
          </div>
          <span className="settings-value">→</span>
        </div>

        <div 
          className="settings-item"
          onClick={() => window.open('https://tempo.xyz', '_blank')}
        >
          <div className="settings-item-left">
            <div className="settings-icon">🌐</div>
            <span className="settings-label">Tempo Website</span>
          </div>
          <span className="settings-value">→</span>
        </div>

        <div 
          className="settings-item"
          onClick={() => window.open('https://explore.tempo.xyz', '_blank')}
        >
          <div className="settings-item-left">
            <div className="settings-icon">🔍</div>
            <span className="settings-label">Block Explorer</span>
          </div>
          <span className="settings-value">→</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Account</span>
        </div>
        
        <div className="settings-item" onClick={handleSignOut}>
          <div className="settings-item-left">
            <div className="settings-icon" style={{ background: 'rgba(255, 77, 77, 0.1)' }}>🚪</div>
            <span className="settings-label" style={{ color: 'var(--error)' }}>Sign Out</span>
          </div>
          <span className="settings-value">→</span>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 32, 
        padding: '0 20px',
        color: 'var(--text-muted)',
        fontSize: 13
      }}>
        <p>Tempo Wallet Demo</p>
        <p style={{ marginTop: 4 }}>
          Built with{' '}
          <a href="https://tempo.xyz" target="_blank" rel="noopener noreferrer" className="link">
            Tempo
          </a>
          {' '}passkey accounts
        </p>
      </div>
    </div>
  )
}
