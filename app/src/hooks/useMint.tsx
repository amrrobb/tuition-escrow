"use client";

import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { wagmiConfig } from "@/lib/rainbowkit";
import { useState } from "react";
import { Address, erc20Abi } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";

interface MintParams {
	amount: string;
	receiver?: Address;
}

export function useMint() {
	const [isPending, setIsPending] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const { address } = useAccount();
	const chainId = useChainId();
	const { data: walletClient } = useWalletClient();

	const reset = () => {
		setIsPending(false);
		setIsSuccess(false);
		setIsError(false);
		setError(null);
	};

	const mint = async ({ amount, receiver }: MintParams) => {
		if (!address || !walletClient) {
			setError(new Error("Wallet not connected"));
			setIsError(true);
			return;
		}

		try {
			setIsPending(true);
			reset();

			const UsdcAddress = getContractAddress(
				chainId,
				ContractName.USDC
			) as Address;

			const receiverAddres = receiver || address;
			const txHash = await writeContract(wagmiConfig, {
				address: UsdcAddress,
				abi: faucetAbi,
				functionName: "mint",
				args: [receiverAddres, amount],
			});

			const result = await waitForTransactionReceipt(wagmiConfig, {
				hash: txHash,
			});

			setIsSuccess(true);
			setIsPending(false);

			return result;
		} catch (err) {
			console.error("Error minting tokens:", err);
			setError(err instanceof Error ? err : new Error("Failed to mint tokens"));
			setIsError(true);
			setIsPending(false);
		}
	};

	return {
		mint,
		isPending,
		isSuccess,
		isError,
		error,
		reset,
	};
}

// Custom faucet ABI with mint function
export const faucetAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	...erc20Abi, // Include the standard ERC20 functions
];
