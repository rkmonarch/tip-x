import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { polygonMumbai } from "wagmi/chains";

const chains = [polygonMumbai];
const walletConnectProjectId = process.env
  .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Tip-land",
    walletConnectProjectId,
    chains,
  })
);
