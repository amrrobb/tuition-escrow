import { Address, getAddress } from "viem";

export interface University {
	id: string;
	name: string;
	address: Address;
	country: string;
}

export const universitiesList: University[] = [
	{
		id: "mit",
		name: "Massachusetts Institute of Technology",
		address: getAddress("0x87E4D09a1885D840B30E83a4c1Fcddc3da6e18Db"),
		country: "United States",
	},
	{
		id: "oxford",
		name: "University of Oxford",
		address: getAddress("0x97a96772e2F6105DCDbBDC8b05FCa517feed950d"),
		country: "United Kingdom",
	},
	{
		id: "tokyo",
		name: "University of Tokyo",
		address: getAddress("0xe4E6A1bC5bebE4Ff5D21945c75Db68ae18c2c6F2"),
		country: "Japan",
	},
	{
		id: "eth",
		name: "ETH Zurich",
		address: getAddress("0xf3673dEb2eC6Fc952626F4F7a61603Ee5C8Dc6CC"),
		country: "Switzerland",
	},
];

export const universitiesMap: Record<Address, University> =
	universitiesList.reduce(
		(acc, university) => ({
			...acc,
			[university.address]: university,
		}),
		{} as Record<Address, University>
	);
