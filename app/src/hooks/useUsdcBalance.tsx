import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { normalize } from "@/lib/bignumber";
import { Address, erc20Abi } from "viem";
import { useChainId, useReadContracts } from "wagmi";

export const useUsdcBalance = (address: Address) => {
	const chainId = useChainId();
	const UsdcAddress = getContractAddress(chainId, ContractName.USDC) as Address;
	const results = useReadContracts({
		allowFailure: false,
		contracts: [
			{
				address: UsdcAddress,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [address],
			},
			{
				address: UsdcAddress,
				abi: erc20Abi,
				functionName: "decimals",
			},
			{
				address: UsdcAddress,
				abi: erc20Abi,
				functionName: "symbol",
			},
		],
	});

	const balance = results?.data?.[0].toString() || 0;
	const decimals = results?.data?.[1] || 18;

	const normalizedBalance = normalize(balance, decimals);
	let formattedBalance;
	if (parseFloat(normalizedBalance) === 0) {
		formattedBalance = "0";
	} else if (parseFloat(normalizedBalance) < 0.01) {
		formattedBalance = "< 0.01";
	} else {
		formattedBalance = parseFloat(normalizedBalance).toFixed(2);
	}
	return { ...results, balance: normalizedBalance, formattedBalance };
};
