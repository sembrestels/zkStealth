"use client";
import { WagmiProvider, cookieStorage, createStorage, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { optimism } from "viem/chains";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';

export const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'YOUR_PROJECT_ID',
    chains: [optimism],
    transports: {
      [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/3LysSMOLSvQ_8o4-WNexp8SydfO9Mm07'),
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
      }),
  });

const RainbowKitConfig = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default RainbowKitConfig;