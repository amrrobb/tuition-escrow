import type { Abi } from "viem";

export const TuitionEscrowABI: Abi = [
	{
		type: "constructor",
		inputs: [{ name: "_stablecoin", type: "address", internalType: "address" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "deposit",
		inputs: [{ name: "paymentId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "initialize",
		inputs: [
			{ name: "payer", type: "address", internalType: "address" },
			{ name: "university", type: "address", internalType: "address" },
			{ name: "amount", type: "uint256", internalType: "uint256" },
			{ name: "invoiceRef", type: "string", internalType: "string" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "owner",
		inputs: [],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "paymentCounter",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "payments",
		inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
		outputs: [
			{ name: "payer", type: "address", internalType: "address" },
			{ name: "university", type: "address", internalType: "address" },
			{
				name: "status",
				type: "uint8",
				internalType: "enum TuitionEscrow.PaymentStatus",
			},
			{ name: "amount", type: "uint256", internalType: "uint256" },
			{ name: "invoiceRef", type: "string", internalType: "string" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "refund",
		inputs: [{ name: "paymentId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "release",
		inputs: [{ name: "paymentId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "stablecoin",
		inputs: [],
		outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "Deposited",
		inputs: [
			{
				name: "paymentId",
				type: "uint256",
				indexed: true,
				internalType: "uint256",
			},
			{
				name: "payer",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "university",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "invoiceRef",
				type: "string",
				indexed: false,
				internalType: "string",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Refunded",
		inputs: [
			{
				name: "paymentId",
				type: "uint256",
				indexed: true,
				internalType: "uint256",
			},
			{
				name: "payer",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Released",
		inputs: [
			{
				name: "paymentId",
				type: "uint256",
				indexed: true,
				internalType: "uint256",
			},
			{
				name: "university",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{ type: "error", name: "InvalidAmount", inputs: [] },
	{ type: "error", name: "InvalidPayer", inputs: [] },
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [{ name: "owner", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [{ name: "account", type: "address", internalType: "address" }],
	},
	{ type: "error", name: "PaymentAlreadyProcessed", inputs: [] },
	{ type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
	{ type: "error", name: "TransferFailed", inputs: [] },
] as const;
