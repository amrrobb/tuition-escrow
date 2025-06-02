"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "@/components/PaymentForm";
import { AdminPanel } from "@/components/AdminPanel";
import { GraduationCap, Shield, DollarSign } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getAddress } from "viem";
import Link from "next/link";
import { ADMIN_ADDRESS } from "@/constants/admin-address";

export default function Home() {
	const { address, isConnected } = useAccount();
	const [activeTab, setActiveTab] = useState("payment");

	// Updated admin addresses including the new one
	const adminAddress = getAddress(ADMIN_ADDRESS);
	const isAdmin = isConnected && adminAddress == getAddress(address as string);

	useEffect(() => {
		if (isAdmin) {
			setActiveTab("admin");
		}
	}, [isAdmin, address]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
			{/* Header */}
			<header className="border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg hover:scale-110 transition-transform duration-200">
								<GraduationCap className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent dark:from-gray-200 dark:to-white">
									TuitionPay
								</h1>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Cross-border Education Payments
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								size="sm"
								asChild
								className="h-9 px-4 py-2 text-sm font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-200"
							>
								<Link href="/faucet" className="flex items-center space-x-2">
									<DollarSign className="h-4 w-4" />
									<span>Get USDC</span>
								</Link>
							</Button>

							<ConnectButton.Custom>
								{({
									account,
									chain,
									openConnectModal,
									openChainModal,
									openAccountModal,
									mounted,
								}) => {
									const ready = mounted;
									const connected = ready && account && chain;

									return (
										<div
											{...(!ready && {
												"aria-hidden": true,
												style: {
													opacity: 0,
													pointerEvents: "none",
													userSelect: "none",
												},
											})}
										>
											{(() => {
												const commonClass =
													"h-9 px-4 py-2 text-sm font-semibold rounded-xl bg-[#111] text-white hover:bg-[#1c1c1c] hover:scale-105 hover:shadow-lg transition-all duration-200";

												if (!connected) {
													return (
														<button
															onClick={openConnectModal}
															className={commonClass}
														>
															Connect Wallet
														</button>
													);
												}

												if (chain.unsupported) {
													return (
														<button
															onClick={openChainModal}
															className={`${commonClass} bg-red-600 hover:bg-red-700`}
														>
															Wrong Network
														</button>
													);
												}

												return (
													<button
														onClick={openAccountModal}
														className={commonClass}
													>
														{account.displayName}
													</button>
												);
											})()}
										</div>
									);
								}}
							</ConnectButton.Custom>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="pt-16 pb-8">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
							Secure Cross-Border
							<span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent dark:from-gray-200 dark:to-white block">
								Tuition Payments
							</span>
						</h2>
						<p className="text-md text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
							Pay university fees securely with USDC. Funds are held in escrow
							until approved by the institution, ensuring safe and transparent
							educational payments worldwide.
						</p>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="pb-8">
				<div className="container mx-auto px-4">
					{!isConnected ? (
						<Card className="max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-3xl hover:scale-105 transition-all duration-300">
							<CardHeader className="text-center space-y-4">
								<div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-200">
									<GraduationCap className="h-10 w-10 text-white" />
								</div>
								<CardTitle className="text-2xl text-gray-900 dark:text-white">
									Connect Your Wallet
								</CardTitle>
								<CardDescription className="text-gray-600 dark:text-gray-300">
									Connect your wallet to start making secure tuition payments
									with blockchain technology
								</CardDescription>
							</CardHeader>
							<CardContent className="text-center space-y-4">
								<div className="flex justify-center">
									<ConnectButton />
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Supports MetaMask and other Web3 wallets
								</p>
							</CardContent>
						</Card>
					) : (
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="max-w-6xl mx-auto"
						>
							<TabsList className="inline-flex w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 px-1 shadow-md hover:shadow-lg transition-all duration-200">
								<TabsTrigger
									value="payment"
									className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-800 data-[state=active]:to-black data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									Make Payment
								</TabsTrigger>
								<TabsTrigger
									value="admin"
									disabled={!isAdmin}
									className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-800 data-[state=active]:to-black data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
								>
									Admin Panel
									{isAdmin && (
										<span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full" />
									)}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="payment" className="mt-8">
								<PaymentForm account={address as string} />
							</TabsContent>

							<TabsContent value="admin" className="mt-8">
								{isAdmin ? (
									<AdminPanel />
								) : (
									<Card className="border border-gray-200 dark:border-gray-700 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
										<CardHeader className="text-center">
											<div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
												<Shield className="h-8 w-8 text-white" />
											</div>
											<CardTitle className="text-xl text-gray-900 dark:text-white">
												Access Denied
											</CardTitle>
											<CardDescription className="text-gray-600 dark:text-gray-300">
												You need admin privileges to access this panel
											</CardDescription>
										</CardHeader>
									</Card>
								)}
							</TabsContent>
						</Tabs>
					)}
				</div>
			</section>
		</div>
	);
}
