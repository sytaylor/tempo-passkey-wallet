import { createConfig, http } from 'wagmi'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'

// Define Tempo testnet chain
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

export const config = createConfig({
  chains: [tempoTestnet],
  connectors: [
    webAuthn({
      // localStorage for demo - use KeyManager.http() for production
      keyManager: KeyManager.localStorage(),
    }),
  ],
  multiInjectedProviderDiscovery: false, // Disable MetaMask detection
  transports: {
    [tempoTestnet.id]: http(),
  },
})

export { tempoTestnet }