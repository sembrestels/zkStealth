"use client";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { optimism } from "viem/chains";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';


const RainbowKitConfig = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'YOUR_PROJECT_ID',
    chains: [optimism],
    transports: {
      [optimism.id]: http(),
    },
  });

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