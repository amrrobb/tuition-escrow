"use client";

import { wagmiConfig } from "@/lib/rainbowkit";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const myTheme: Theme = {
	...darkTheme(),
	colors: {
		...darkTheme().colors,
		accentColor: "#27272A",
	},
};

export default function Provider({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider theme={myTheme}>{children}</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
