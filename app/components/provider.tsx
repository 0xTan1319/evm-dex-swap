'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider,darkTheme  } from '@rainbow-me/rainbowkit';

import { config } from '../config/wagmi';

const queryClient = new QueryClient();

const customTheme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: '#6144e5', // Purple color
    accentColorForeground: '#fff',
    // You can customize more colors if needed
  },
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <div className="absolute min-h-full w-full bg-[url('/img/MintPageBackground.webp')] bg-repeat -z-10">
          {children}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;