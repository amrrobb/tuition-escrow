import { denormalize } from "@/lib/bignumber";
import { wagmiConfig } from "@/lib/rainbowkit";
import { useMutation } from "@tanstack/react-query";
import {
	readContract,
	sendTransaction,
	waitForTransactionReceipt,
	writeContract,
} from "wagmi/actions";
import { useState } from "react";
import { Address, encodeFunctionData, erc20Abi } from "viem";
import { useAccount, useChainId } from "wagmi";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { TuitionEscrowABI } from "@/abi/TuitionEscrowABI";

type Status = "idle" | "loading" | "success" | "error";

export const useDeposit = () => {
	const { address: userAddress } = useAccount();
	const chainId = useChainId();

	const [steps, setSteps] = useState<
		Array<{
			step: number;
			status: Status;
			error?: string;
		}>
	>([
		{
			step: 1,
			status: "idle",
		},
		{
			step: 2,
			status: "idle",
		},
		{
			step: 3,
			status: "idle",
		},
	]);

	const mutation = useMutation({
		mutationFn: async ({
			amount,
			university,
			invoiceRef,
		}: {
			amount: string;
			university: Address;
			invoiceRef: string;
		}) => {
			try {
				const TuitionEscrowAddress = getContractAddress(
					chainId,
					ContractName.TuitionEscrow
				) as Address;

				// Reset steps
				setSteps([
					{ step: 1, status: "idle" },
					{ step: 2, status: "idle" },
					{ step: 3, status: "idle" },
				]);

				if (!amount || !userAddress || !university || !invoiceRef) {
					throw new Error("Invalid parameters");
				}

				const denormalizeUserAmount = denormalize(amount || "0", 6);
				const userInputBn = BigInt(denormalizeUserAmount);

				const UsdcAddress = getContractAddress(
					chainId,
					ContractName.USDC
				) as Address;

				// Step 1: Check and approve USDC allowance
				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 1) {
							return { ...item, status: "loading" };
						}
						return item;
					})
				);

				const allowanceData = await readContract(wagmiConfig, {
					address: UsdcAddress,
					abi: erc20Abi,
					functionName: "allowance",
					args: [userAddress, TuitionEscrowAddress],
				});

				if (allowanceData !== undefined) {
					if (
						(allowanceData === BigInt(0) || allowanceData < userInputBn) &&
						userInputBn !== BigInt(0)
					) {
						const data = encodeFunctionData({
							abi: erc20Abi,
							functionName: "approve",
							args: [TuitionEscrowAddress, userInputBn],
						});

						const txHash = await sendTransaction(wagmiConfig, {
							to: UsdcAddress,
							data,
						});
						const receipt = await waitForTransactionReceipt(wagmiConfig, {
							hash: txHash,
						});
						if (receipt) {
							setSteps((prev) =>
								prev.map((item) => {
									if (item.step === 1) {
										return { ...item, status: "success" };
									}
									return item;
								})
							);
						}
					} else {
						setSteps((prev) =>
							prev.map((item) => {
								if (item.step === 1) {
									return { ...item, status: "success" };
								}
								return item;
							})
						);
					}
				}

				// Step 2: Initialize payment
				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 2) {
							return { ...item, status: "loading" };
						}
						return item;
					})
				);

				const initializeTx = await writeContract(wagmiConfig, {
					address: TuitionEscrowAddress,
					abi: TuitionEscrowABI,
					functionName: "initialize",
					args: [userAddress, university, userInputBn, invoiceRef],
				});

				const initializeReceipt = await waitForTransactionReceipt(wagmiConfig, {
					hash: initializeTx,
				});
				console.log("initializeReceipt", initializeReceipt);

				// Check transaction status
				if (initializeReceipt.status !== "success") {
					throw new Error("Initialize transaction failed");
				}

				// Get paymentCounter as a starting point
				const paymentId = (await readContract(wagmiConfig, {
					address: TuitionEscrowAddress,
					abi: TuitionEscrowABI,
					functionName: "paymentCounter",
					args: [],
				})) as bigint;

				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 2) {
							return { ...item, status: "success" };
						}
						return item;
					})
				);

				// Step 3: Deposit with paymentId
				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 3) {
							return { ...item, status: "loading" };
						}
						return item;
					})
				);

				const depositTx = await writeContract(wagmiConfig, {
					address: TuitionEscrowAddress as Address,
					abi: TuitionEscrowABI,
					functionName: "deposit",
					args: [BigInt(paymentId)],
				});

				const result = await waitForTransactionReceipt(wagmiConfig, {
					hash: depositTx,
				});

				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 3) {
							return { ...item, status: "success" };
						}
						return item;
					})
				);

				return result;
			} catch (e) {
				console.error("Error", e);
				setSteps((prev) =>
					prev.map((step) => {
						if (step.status === "loading") {
							return { ...step, status: "error", error: (e as Error).message };
						}
						return step;
					})
				);
				throw e;
			}
		},
	});

	return { steps, mutation };
};
