import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "viem/chains";

export const wagmiConfig = createConfig({
	chains: [arbitrumSepolia],
	transports: {
		[arbitrumSepolia.id]: http(
			arbitrumSepolia.rpcUrls.default.http[0]
			// "https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
		),
	},
});
