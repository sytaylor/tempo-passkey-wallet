interface ActivityProps {
  address: `0x${string}`
  onBack: () => void
}

export function Activity({ address, onBack }: ActivityProps) {
  // In a real app, you'd fetch transaction history from an API
  // For now, we'll show the explorer link
  
  return (
    <div>
      <div className="header">
        <button className="header-back" onClick={onBack}>
          ← Back
        </button>
        <span className="header-title">Activity</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3 className="empty-title">Transaction History</h3>
        <p className="empty-text">
          View your complete transaction history on the Tempo block explorer.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 24, maxWidth: 280, margin: '24px auto 0' }}
          onClick={() => window.open(`https://explore.tempo.xyz/address/${address}`, '_blank')}
        >
          View on Explorer
        </button>
      </div>

      {/* Example transactions - would be populated from API */}
      <div className="card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <span className="card-title">Recent</span>
        </div>
        
        <div className="tx-list">
          <div 
            className="tx-item"
            onClick={() => window.open(`https://explore.tempo.xyz/address/${address}`, '_blank')}
          >
            <div className="tx-icon received">↓</div>
            <div className="tx-details">
              <div className="tx-title">Faucet</div>
              <div className="tx-subtitle">Received test funds</div>
            </div>
            <div className="tx-amount">
              <div className="tx-amount-value received">+$100.00</div>
              <div className="tx-amount-usd">AlphaUSD</div>
            </div>
          </div>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: 'var(--text-muted)', 
          fontSize: 13, 
          marginTop: 16,
          padding: '0 16px'
        }}>
          Transaction history will appear here after you make payments.
        </p>
      </div>
    </div>
  )
}
