"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Coins, ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMint } from "@/hooks/useMint";

export default function Faucet() {
	const { isConnected, chainId, address } = useAccount();

	const [amount, setAmount] = useState("1000");
	const [isLoading, setIsLoading] = useState(false);
	const { mint } = useMint();

	const handleMint = async () => {
		if (!isConnected || !address) {
			toast({
				title: "Wallet not connected",
				description: "Please connect your wallet first",
				variant: "destructive",
			});
			return;
		}

		if (chainId !== 421614) {
			toast({
				title: "Wrong network",
				description: "Please switch to Arbitrum Sepolia",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			// Mock USDC faucet contract address for Arbitrum Sepolia
			await mint({
				amount: amount.toString(),
				receiver: address,
			});
			toast({
				title: "USDC Minted Successfully!",
				description: `${amount} USDC has been minted to your wallet`,
			});
		} catch (error) {
			console.error("Minting failed:", error);
			toast({
				title: "Minting Failed",
				description: "Failed to mint USDC tokens. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			{/* Header */}
			<header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link
								href="/"
								className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								<ArrowLeft className="h-5 w-5" />
								{/* <span>Back to TuitionPay</span> */}
							</Link>
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
									<Coins className="h-6 w-6 text-white" />
								</div>
								<div>
									<h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
										USDC Faucet
									</h1>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Get testnet USDC tokens
									</p>
								</div>
							</div>
						</div>

						{/* <WalletConnect
							isConnected={isConnected}
							account={account}
							balance={balance}
							networkName={networkName}
							chainId={chainId}
							onConnect={connectWallet}
							onDisconnect={disconnect}
							onRefreshBalance={refreshBalance}
							onSwitchToArbitrum={switchToArbitrumSepolia}
							getNetworkInfo={getNetworkInfo}
						/> */}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					{/* Hero Section */}
					<div className="text-center mb-12">
						<div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
							<DollarSign className="h-12 w-12 text-white" />
						</div>
						<h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
							USDC Testnet Faucet
						</h2>
						<p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
							Get free USDC tokens for testing on Arbitrum Sepolia network
						</p>
					</div>

					{!isConnected ? (
						<Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
							<CardHeader className="text-center space-y-4">
								<div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
									<Coins className="h-8 w-8 text-white" />
								</div>
								<CardTitle className="text-2xl text-slate-900 dark:text-white">
									Connect Your Wallet
								</CardTitle>
								<CardDescription className="text-slate-600 dark:text-slate-300">
									Connect your wallet to mint testnet USDC tokens
								</CardDescription>
							</CardHeader>
							{/* <CardContent className="text-center space-y-4">
								<Button
									onClick={connectWallet}
									className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
									size="lg"
								>
									Connect Wallet
								</Button>
							</CardContent> */}
							<ConnectButton />
						</Card>
					) : (
						<Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-2xl text-slate-900 dark:text-white flex items-center space-x-2">
									<Coins className="h-6 w-6 text-green-600" />
									<span>Mint USDC Tokens</span>
								</CardTitle>
								<CardDescription className="text-slate-600 dark:text-slate-300">
									Enter the amount of USDC you want to mint for testing
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{chainId !== 421614 && (
									<div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
										<p className="text-orange-800 dark:text-orange-200 text-sm">
											⚠️ Please switch to Arbitrum Sepolia network to use the
											faucet
										</p>
									</div>
								)}

								<div className="space-y-4">
									<div>
										<Label
											htmlFor="amount"
											className="text-slate-900 dark:text-white"
										>
											Amount (USDC)
										</Label>
										<Input
											id="amount"
											type="number"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											placeholder="Enter amount"
											className="mt-1"
											min="1"
											max="10000"
										/>
										<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
											Maximum 10.000 USDC per transaction
										</p>
									</div>

									<Button
										onClick={handleMint}
										disabled={isLoading || !amount || chainId !== 421614}
										className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
										size="lg"
									>
										{isLoading ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Minting...
											</>
										) : (
											<>
												<Coins className="h-4 w-4 mr-2" />
												Mint {amount} USDC
											</>
										)}
									</Button>
								</div>

								<div className="pt-4 border-t border-slate-200 dark:border-slate-700">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-slate-500 dark:text-slate-400">
												Network:
											</span>
											<p className="font-medium text-slate-900 dark:text-white">
												{chainId === 421614 ? "Arbitrum Sepolia" : "Unknown"}
											</p>
										</div>
										<div>
											<span className="text-slate-500 dark:text-slate-400">
												Your Balance:
											</span>
											{/* <p className="font-medium text-slate-900 dark:text-white">
												{balance || "0.0000"} ETH
											</p> */}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Info Section */}
					<div className="mt-12 grid md:grid-cols-2 gap-6">
						<Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-lg text-slate-900 dark:text-white">
									How it works
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
								<p>• Connect your wallet to Arbitrum Sepolia</p>
								<p>• Enter the amount of USDC you need</p>
								<p>• Click &quot;Mint&quot; to receive tokens instantly</p>
								<p>• Use tokens for testing payments</p>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-lg text-slate-900 dark:text-white">
									Important Notes
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
								<p>• These are testnet tokens only</p>
								<p>• Maximum 1000 USDC per transaction</p>
								<p>• Requires Arbitrum Sepolia network</p>
								<p>• Free for testing purposes</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
