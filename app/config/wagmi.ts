import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  cronos,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "EVM-dex | swap | liquidity | vault",
  // projectId: 'YOUR_PROJECT_ID',
  projectId: "51a8a52bcc0730097ea92eed587f88cb",
  chains: [cronos],
  ssr: true,
});
