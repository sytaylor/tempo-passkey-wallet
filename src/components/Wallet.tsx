import { useState, useEffect } from 'react'
import { useDisconnect } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { Card, Button } from './Auth'
import { SendPayment } from './SendPayment'

const ALPHA_USD = '0x20c0000000000000000000000000000000000001'
const RPC_URL = 'https://rpc.testnet.tempo.xyz'

const tempoTestnet = {
  id: 42429,
  name: 'Tempo Testnet',
  nativeCurrency: { decimals: 18, name: 'USD', symbol: 'USD' },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' },
  },
} as const

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const

export function Wallet({ address }: { address: `0x${string}` }) {
  const { disconnect } = useDisconnect()
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [faucetStatus, setFaucetStatus] = useState('')

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
    setLoading(true)
    setFaucetStatus('Requesting funds...')

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
        setFaucetStatus('Failed to request funds: ' + result.error.message)
      } else {
        setFaucetStatus('Funds requested successfully!')
      }
    } catch (error) {
      setFaucetStatus('Error requesting funds.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBalance()
  }, [])

  return (
    <Card>
      <h2>Wallet</h2>
      <p>Address: {address}</p>
      <p>Balance: {balance ? `${balance} USD` : 'Loading...'}</p>
      <Button onClick={checkBalance}>Refresh Balance</Button>
      <Button onClick={requestFaucet} disabled={loading}>
        {loading ? 'Requesting...' : 'Request Faucet'}
      </Button>
      {faucetStatus && <p>{faucetStatus}</p>}
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </Card>
  )
}