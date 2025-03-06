import { defineChain } from "viem";

export const vanguard = defineChain({
  id: 78600,
  name: "Vanguard",
  nativeCurrency: { name: "VG", symbol: "VG", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc-vanguard.vanarchain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Vanguard Explorer",
      url: "https://explorer-vanguard.vanarchain.com/",
    },
  },
});
