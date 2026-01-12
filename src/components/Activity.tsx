import { useState, useEffect } from 'react'
import { createPublicClient, http, decodeEventLog, formatUnits } from 'viem'

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
    name: 'Transfer',
    type: 'event',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
  },
] as const

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  blockNumber: bigint
  timestamp?: number
  type: 'sent' | 'received'
}

interface ActivityProps {
  address: `0x${string}`
  onBack: () => void
}

export function Activity({ address, onBack }: ActivityProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)

    const client = createPublicClient({
      chain: tempoTestnet,
      transport: http(RPC_URL),
    })

    try {
      // Fetch Transfer events where user is sender or receiver
      // Search from block 0 to get complete history (testnet has limited blocks)
      const [sentLogs, receivedLogs] = await Promise.all([
        // Transactions sent by user
        client.getLogs({
          address: ALPHA_USD,
          event: erc20Abi[0],
          fromBlock: 0n,
          toBlock: 'latest',
          args: {
            from: address,
          },
        }),
        // Transactions received by user
        client.getLogs({
          address: ALPHA_USD,
          event: erc20Abi[0],
          fromBlock: 0n,
          toBlock: 'latest',
          args: {
            to: address,
          },
        }),
      ])

      // Process and combine transactions
      const allTxs: Transaction[] = []

      console.log('[Activity Debug] Sent logs:', sentLogs.length)
      for (const log of sentLogs) {
        const tx = {
          hash: log.transactionHash!,
          from: log.args.from!,
          to: log.args.to!,
          value: formatUnits(log.args.value!, 6),
          blockNumber: log.blockNumber!,
          type: 'sent' as const,
        }
        console.log('[Activity Debug] Sent:', tx)
        allTxs.push(tx)
      }

      console.log('[Activity Debug] Received logs:', receivedLogs.length)
      for (const log of receivedLogs) {
        // Skip if it's also in sent (to avoid duplicates)
        if (!allTxs.find(tx => tx.hash === log.transactionHash)) {
          const tx = {
            hash: log.transactionHash!,
            from: log.args.from!,
            to: log.args.to!,
            value: formatUnits(log.args.value!, 6),
            blockNumber: log.blockNumber!,
            type: 'received' as const,
          }
          console.log('[Activity Debug] Received:', tx)
          allTxs.push(tx)
        } else {
          console.log('[Activity Debug] Skipped duplicate:', log.transactionHash)
        }
      }

      // Sort by block number (most recent first)
      allTxs.sort((a, b) => Number(b.blockNumber - a.blockNumber))

      console.log('[Activity Debug] Total transactions:', allTxs.length)
      setTransactions(allTxs)
    } catch (e) {
      console.error('Failed to fetch transactions:', e)
      setError('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [address])

  return (
    <div>
      <div className="header">
        <button className="header-back" onClick={onBack}>
          ← Back
        </button>
        <span className="header-title">Activity</span>
        <button
          className="header-back"
          onClick={fetchTransactions}
          disabled={loading}
          style={{ width: 60, fontSize: 18 }}
        >
          🔄
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3 className="empty-title">Loading...</h3>
          <p className="empty-text">
            Fetching your transaction history from Tempo testnet
          </p>
        </div>
      )}

      {error && (
        <div className="status status-error" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 className="empty-title">No Transactions Yet</h3>
          <p className="empty-text">
            Your transaction history will appear here after you send or receive payments.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 24, maxWidth: 280, margin: '24px auto 0' }}
            onClick={() => window.open(`https://explore.tempo.xyz/address/${address}`, '_blank')}
          >
            View on Explorer
          </button>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <span className="card-title">Recent Transactions</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {transactions.length} total
            </span>
          </div>

          <div className="tx-list">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="tx-item"
                onClick={() => window.open(`https://explore.tempo.xyz/tx/${tx.hash}`, '_blank')}
              >
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'received' ? '↓' : '↑'}
                </div>
                <div className="tx-details">
                  <div className="tx-title">
                    {tx.type === 'received' ? 'Received' : 'Sent'}
                  </div>
                  <div className="tx-subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    {tx.type === 'received'
                      ? `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                      : `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                    }
                  </div>
                </div>
                <div className="tx-amount">
                  <div className={`tx-amount-value ${tx.type}`}>
                    {tx.type === 'received' ? '+' : '-'}${Number(tx.value).toFixed(2)}
                  </div>
                  <div className="tx-amount-usd">AlphaUSD</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => window.open(`https://explore.tempo.xyz/address/${address}`, '_blank')}
          >
            View All on Explorer →
          </button>
        </div>
      )}
    </div>
  )
}
