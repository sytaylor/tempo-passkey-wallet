import { useAccount } from 'wagmi'
import { Auth } from './components/Auth'
import { Wallet } from './components/Wallet'

export function App() {
  const { address, isConnected } = useAccount()

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        ⚡ Tempo Wallet
      </h1>
      
      {!isConnected ? (
        <Auth />
      ) : (
        <Wallet address={address!} />
      )}
      
      <p style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        fontSize: '12px', 
        color: '#888' 
      }}>
        Testnet only • No real funds
      </p>
    </div>
  )
}