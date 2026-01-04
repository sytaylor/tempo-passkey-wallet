import { createConfig, http } from 'wagmi'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'

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
      keyManager: KeyManager.localStorage(),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  transports: {
    [tempoTestnet.id]: http(),
  },
})

export { tempoTestnet }
