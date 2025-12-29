import { useConnect, useConnectors } from 'wagmi'

export function Auth() {
  const { connect, isPending, error } = useConnect()
  const [connector] = useConnectors()

  if (isPending) {
    return (
      <Card>
        <p style={{ textAlign: 'center' }}>
          🔐 Check your device for the passkey prompt...
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Sign in with your device's biometrics. No wallet app needed.
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          onClick={() =>
            connect({
              connector,
              // @ts-ignore - tempo.ts extends wagmi types
              capabilities: { type: 'sign-up' },
            })
          }
          primary
        >
          Create Account
        </Button>

        <Button onClick={() => connect({ connector })}>
          Sign In
        </Button>
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontSize: '14px' }}>
          {error.message}
        </p>
      )}
    </Card>
  )
}

// Simple styled components
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {children}
    </div>
  )
}

function Button({ 
  children, 
  onClick, 
  primary, 
  disabled 
}: { 
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '12px 20px',
        borderRadius: '8px',
        border: primary ? 'none' : '1px solid #ddd',
        background: primary ? '#0066ff' : 'white',
        color: primary ? 'white' : '#333',
        fontSize: '16px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}

export { Card, Button }