import { useState, useEffect } from 'react'
import { createPublicClient, http } from 'viem'

const ALPHA_USD = '0x20c0000000000000000000000000000000000001'
const RPC_URL = 'https://rpc.testnet.tempo.xyz'

const tempoTestnet = {
  id: 42429,
  name: 'Tempo Testnet',
  nativeCurrency: { decimals: 18, name: 'USD', symbol: 'USD' },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' } },
} as const

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const

type View = 'home' | 'send' | 'activity' | 'settings'

interface HomeProps {
  address: `0x${string}`
  onNavigate: (view: View) => void
}

export function Home({ address, onNavigate }: HomeProps) {
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [faucetStatus, setFaucetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const checkBalance = async () => {
    const client = createPublicClient({
      chain: tempoTestnet,
      transport: http(RPC_URL),
    })

    try {
      const bal = await client.readContract({
        address: ALPHA_USD,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })
      setBalance((Number(bal) / 1e6).toFixed(2))
    } catch (e) {
      console.error('Balance check failed:', e)
    }
  }

  const requestFaucet = async () => {
    setFaucetStatus('loading')

    try {
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tempo_fundAddress',
          params: [address],
          id: 1,
        }),
      })

      const result = await response.json()
      if (result.error) {
        setFaucetStatus('error')
      } else {
        setFaucetStatus('success')
        setTimeout(() => {
          checkBalance()
          setFaucetStatus('idle')
        }, 2000)
      }
    } catch (e) {
      setFaucetStatus('error')
      setTimeout(() => setFaucetStatus('idle'), 3000)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    checkBalance()
    const interval = setInterval(checkBalance, 30000)
    return () => clearInterval(interval)
  }, [address])

  return (
    <div>
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">
          <span className="currency">$</span>
          {balance ?? '—'}
        </div>
        <div className="balance-token">AlphaUSD on Tempo Testnet</div>

        <div className="balance-actions">
          <button className="action-btn" onClick={() => onNavigate('send')}>
            <div className="action-btn-icon">↑</div>
            <span className="action-btn-label">Send</span>
          </button>
          <button className="action-btn" onClick={copyAddress}>
            <div className="action-btn-icon">↓</div>
            <span className="action-btn-label">{copied ? 'Copied!' : 'Receive'}</span>
          </button>
          <button 
            className="action-btn" 
            onClick={requestFaucet}
            disabled={faucetStatus === 'loading'}
          >
            <div className="action-btn-icon">
              {faucetStatus === 'loading' ? '⏳' : faucetStatus === 'success' ? '✓' : '+'}
            </div>
            <span className="action-btn-label">
              {faucetStatus === 'loading' ? 'Loading...' : faucetStatus === 'success' ? 'Done!' : 'Get Funds'}
            </span>
          </button>
        </div>
      </div>

      {/* Address Card */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Your Address</span>
        </div>
        <div className="address-display" onClick={copyAddress}>
          <div className="address-avatar">
            {address.slice(2, 4).toUpperCase()}
          </div>
          <span className="address-text">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="address-copy">{copied ? '✓' : 'Copy'}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        
        <div 
          className="settings-item" 
          onClick={() => window.open(`https://explore.tempo.xyz/address/${address}`, '_blank')}
        >
          <div className="settings-item-left">
            <div className="settings-icon">🔍</div>
            <span className="settings-label">View on Explorer</span>
          </div>
          <span className="settings-value">→</span>
        </div>

        <div className="settings-item" onClick={() => onNavigate('activity')}>
          <div className="settings-item-left">
            <div className="settings-icon">📋</div>
            <span className="settings-label">Transaction History</span>
          </div>
          <span className="settings-value">→</span>
        </div>

        <div className="settings-item" onClick={checkBalance}>
          <div className="settings-item-left">
            <div className="settings-icon">🔄</div>
            <span className="settings-label">Refresh Balance</span>
          </div>
          <span className="settings-value">→</span>
        </div>
      </div>

      {faucetStatus === 'error' && (
        <div className="status status-error">
          Faucet request failed. Try again in a moment.
        </div>
      )}
    </div>
  )
}
