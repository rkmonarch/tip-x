import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "../context/wagmi";
import { ConnectKitProvider } from "connectkit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider theme="retro">
        
          <Component {...pageProps} />
        
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
