import { http, createConfig } from '@wagmi/core'
import { cronos } from '@wagmi/core/chains'

export const configMy = createConfig({
  chains: [cronos],
  transports: {
    [cronos.id]: http(),
  },
})