import { useState } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'

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

interface SendProps {
  address: `0x${string}`
  onBack: () => void
}

export function Send({ address, onBack }: SendProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')

  const {
    sendTransaction,
    data: hash,
    isPending,
    error,
    reset,
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

  const handleQuickAmount = (value: string) => {
    setAmount(value)
  }

  const handleReset = () => {
    setRecipient('')
    setAmount('')
    setStep('input')
    reset()
  }

  // Success state
  if (isSuccess && hash) {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="success-check" />
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Payment Sent!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            ${amount} AlphaUSD sent successfully
          </p>
          
          <div className="card" style={{ textAlign: 'left' }}>
            <div className="settings-item" style={{ border: 'none' }}>
              <div className="settings-item-left">
                <span className="settings-label">To</span>
              </div>
              <span className="settings-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {recipient.slice(0, 8)}...{recipient.slice(-6)}
              </span>
            </div>
            <div className="settings-item" style={{ border: 'none' }}>
              <div className="settings-item-left">
                <span className="settings-label">Amount</span>
              </div>
              <span className="settings-value">${amount} AlphaUSD</span>
            </div>
          </div>

          <a
            href={`https://explore.tempo.xyz/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            style={{ display: 'block', marginBottom: 24, fontSize: 14 }}
          >
            View on Explorer →
          </a>

          <button className="btn btn-primary" onClick={handleReset}>
            Send Another Payment
          </button>
          <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: 8 }}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="header">
        <button className="header-back" onClick={onBack}>
          ← Back
        </button>
        <span className="header-title">Send Payment</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Amount Input */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Amount</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>AlphaUSD</span>
        </div>
        <input
          type="number"
          className="input-field input-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          style={{ fontSize: 40, textAlign: 'center', fontWeight: 700 }}
        />
        <div className="quick-amounts">
          <button className="quick-amount-btn" onClick={() => handleQuickAmount('10')}>$10</button>
          <button className="quick-amount-btn" onClick={() => handleQuickAmount('25')}>$25</button>
          <button className="quick-amount-btn" onClick={() => handleQuickAmount('50')}>$50</button>
          <button className="quick-amount-btn" onClick={() => handleQuickAmount('100')}>$100</button>
        </div>
      </div>

      {/* Recipient Input */}
      <div className="card">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Recipient Address</label>
          <input
            type="text"
            className="input-field"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>
      </div>

      {/* Summary */}
      {amount && recipient && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Summary</span>
          </div>
          <div className="settings-item" style={{ borderBottom: 'none', padding: '12px 0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Sending</span>
            <span style={{ fontWeight: 600 }}>${amount} AlphaUSD</span>
          </div>
          <div className="settings-item" style={{ borderBottom: 'none', padding: '12px 0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>To</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {recipient.slice(0, 8)}...{recipient.slice(-6)}
            </span>
          </div>
          <div className="settings-item" style={{ borderBottom: 'none', padding: '12px 0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Network Fee</span>
            <span style={{ color: 'var(--success)' }}>{'<$0.001'}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="status status-error">
          {error.message.slice(0, 100)}
        </div>
      )}

      {/* Send Button */}
      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={!amount || !recipient || isPending || isConfirming}
        style={{ marginTop: 8 }}
      >
        {isPending ? (
          <>
            <span className="spinner" />
            Confirm with Passkey...
          </>
        ) : isConfirming ? (
          <>
            <span className="spinner" />
            Confirming...
          </>
        ) : (
          `Send $${amount || '0'} AlphaUSD`
        )}
      </button>
    </div>
  )
}
