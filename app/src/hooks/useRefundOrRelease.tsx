import { wagmiConfig } from "@/lib/rainbowkit";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { TuitionEscrowABI } from "@/abi/TuitionEscrowABI";

type Status = "idle" | "loading" | "success" | "error";
type Option = "refund" | "release";

export const useReleaseOrRefund = () => {
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
	]);

	const mutation = useMutation({
		mutationFn: async ({
			option,
			paymentId,
		}: {
			option: Option;
			paymentId: string;
		}) => {
			try {
				const TuitionEscrowAddress = getContractAddress(
					chainId,
					ContractName.TuitionEscrow
				) as Address;

				// Reset steps
				setSteps([{ step: 1, status: "loading" }]);

				// Execute refund or release based on option
				const tx = await writeContract(wagmiConfig, {
					address: TuitionEscrowAddress,
					abi: TuitionEscrowABI,
					functionName: option, // "refund" or "release"
					args: [BigInt(paymentId)],
				});

				const result = await waitForTransactionReceipt(wagmiConfig, {
					hash: tx,
				});

				if (result.status === "success") {
					setSteps((prev) =>
						prev.map((item) => ({
							...item,
							status: "success",
						}))
					);
				}

				return result;
			} catch (e) {
				console.error("Error", e);
				setSteps((prev) =>
					prev.map((step) => ({
						...step,
						status: "error",
						error: (e as Error).message,
					}))
				);
				throw e;
			}
		},
	});

	return { steps, mutation };
};
