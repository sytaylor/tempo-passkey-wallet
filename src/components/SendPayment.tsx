import { useState } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'
import { Card, Button } from './Auth'

const ALPHA_USD = '0x20c0000000000000000000000000000000000001'

const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const

export function SendPayment({ 
  address, 
  onSuccess 
}: { 
  address: `0x${string}`
  onSuccess: () => void 
}) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [expanded, setExpanded] = useState(false)

  const { 
    sendTransaction, 
    data: hash, 
    isPending, 
    error,
    reset 
  } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSend = () => {
    if (!recipient || !amount) return

    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parseUnits(amount, 6)],
    })

    sendTransaction({
      to: ALPHA_USD,
      data,
    })
  }

  // Reset form after success
  if (isSuccess) {
    setTimeout(() => {
      setRecipient('')
      setAmount('')
      reset()
      onSuccess()
    }, 3000)
  }

  if (!expanded) {
    return (
      <Card>
        <Button onClick={() => setExpanded(true)} primary>
          Send Payment
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Send AlphaUSD</h3>
        <button
          onClick={() => setExpanded(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#666' }}>
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#666' }}>
          Amount (AlphaUSD)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />
      </div>

      <Button
        onClick={handleSend}
        primary
        disabled={isPending || isConfirming || !recipient || !amount}
      >
        {isPending
          ? '🔐 Confirm with passkey...'
          : isConfirming
          ? 'Confirming...'
          : 'Send'}
      </Button>

      {error && (
        <p style={{ color: 'red', marginTop: '12px', fontSize: '14px' }}>
          {error.message}
        </p>
      )}

      {isSuccess && hash && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#2e7d32', fontWeight: 500 }}>✓ Payment sent!</p>
          <a
            href={`https://explore.tempo.xyz/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '14px', color: '#1565c0' }}
          >
            View transaction →
          </a>
        </div>
      )}
    </Card>
  )
}