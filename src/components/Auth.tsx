import { useConnect, useConnectors } from 'wagmi'

export function Auth() {
  const { connect, isPending, error } = useConnect()
  const [connector] = useConnectors()

  if (isPending) {
    return (
      <div className="auth-screen">
        <div className="auth-content">
          <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Confirm with your device</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Use Face ID, Touch ID, or your security key
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-screen">
      <div className="auth-content">
        <div className="auth-logo">⚡</div>
        <h1 className="auth-title">Tempo Wallet</h1>
        <p className="auth-subtitle">
          Send stablecoin payments instantly.<br />
          No seed phrases. No extensions.
        </p>

        <div className="auth-buttons">
          <button
            className="btn btn-primary"
            onClick={() =>
              connect({
                connector,
                // @ts-ignore
                capabilities: { type: 'sign-up' },
              })
            }
          >
            <span>🔐</span>
            Create New Wallet
          </button>

          <div className="auth-divider">or</div>

          <button
            className="btn btn-secondary"
            onClick={() => connect({ connector })}
          >
            Sign In with Passkey
          </button>
        </div>

        {error && (
          <div className="status status-error" style={{ marginTop: 24 }}>
            {error.message}
          </div>
        )}

        <div className="auth-footer">
          <span className="testnet-badge">
            <span>⚠️</span>
            Testnet Only
          </span>
          <p style={{ marginTop: 16 }}>
            Powered by{' '}
            <a href="https://tempo.xyz" target="_blank" rel="noopener noreferrer">
              Tempo
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
