# 🎓 Tuition Escrow Project

A decentralized tuition payment system built on Arbitrum Sepolia that enables secure and transparent educational payments through smart contracts.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/amrrobb/tuition-escrow)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://tuition-escrow-app.vercel.app/)

## 📋 Overview

This blockchain-based escrow system for educational institutions and students features:

- Smart contract-powered payment processing
- User-friendly Next.js frontend interface
- Real-time payment tracking via TheGraph
- Mock USDC token for testing purposes

## 🔗 Deployed Contracts (Arbitrum Sepolia)

| Contract      | Address                                      | Explorer                                                                                           |
| ------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| TuitionEscrow | `0xF4e4A3Eba75DAb37E2cAC7694a3b5F0965CC70f9` | [View on Arbiscan](https://sepolia.arbiscan.io/address/0xF4e4A3Eba75DAb37E2cAC7694a3b5F0965CC70f9) |
| USDC (Mock)   | `0xD4462a6e718f217BF41030165E1b64E235482AA0` | [View on Arbiscan](https://sepolia.arbiscan.io/address/0xD4462a6e718f217BF41030165E1b64E235482AA0) |

## 🔍 Key Resources

- **Subgraph API**: [Query Endpoint](https://api.studio.thegraph.com/query/95824/tuition-escrow/version/latest)
- **Live Frontend**: [Vercel Deployment](https://tuition-escrow-app.vercel.app/)

## 🛠 Development Setup

### Prerequisites

- Node.js (v16+) and npm (v8+)
- Foundry (Install with: `curl -L https://foundry.paradigm.xyz | bash` followed by `foundryup`)
- Git
- `.env` file in `contracts/` directory containing:
  ```
  PRIVATE_KEY=your_private_key
  ALCHEMY_API_KEY=your_alchemy_api_key
  ETHERSCAN_API_KEY=your_etherscan_api_key
  ```

### Project Structure

```
tuition-escrow/
├── app/                  # Next.js frontend application
├── contracts/           # Smart contract development
│   ├── script/         # Contract deployment scripts
│   ├── src/            # Core contract source code
│   ├── test/           # Contract test suite
│   ├── .env            # Environment variables (not committed)
│   └── Makefile        # Build and deployment automation
├── subgraph/           # TheGraph indexing services
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Setup Instructions

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/amrrobb/tuition-escrow
cd tuition-escrow
```

### 2. Install Dependencies & Compile Contracts

This command will install all required dependencies for both the frontend application and smart contracts, then compile the contracts:

```bash
npm run setup
```

### 3. Run Tests on Smart Contracts

```bash
npm run test
```

You can find the complete test suite in [`contracts/test/TuitionEscrowTest.t.sol`](./contracts/test/TuitionEscrowTest.t.sol)

---

## 🧪 Local Development (Optional)

### 4. Run Local Blockchain

```bash
npm run chain
```

### 5. Deploy to Local Network

Run it on different terminal from the previous one.

```bash
npm run deploy
```

---

## 🌐 Deploy to Arbitrum Sepolia

### 6. Deploy Contracts

```bash
npm run deploy network=arbitrumSepolia
```

Alternatively, use this command to deploy and verify contracts on Arbiscan in a single step.

```bash
npm run deploy:verify network=arbitrumSepolia
```

and you can find the ouput in the terminal.

#### Example Deployment Output

```
== Logs ==
USDC_ADDRESS=0x28890367dafd315f70955AD18D445721Bc5b76dd
TUITION_ESCROW_ADDRESS=0x769BBa034B8b5aA1e03a378Fc1d345ea9240a38e
```

---

## 🛠 Frontend Config

The live demo uses the following contract configuration. Update these values if deploying your own version:

```json
{
	"421614": {
		"TuitionEscrow": "0xF4e4A3Eba75DAb37E2cAC7694a3b5F0965CC70f9",
		"USDC": "0xD4462a6e718f217BF41030165E1b64E235482AA0"
	}
}
```

You can find the contract addresses here: [`app/src/constants/contract/contract-address.json`](./app/src/constants/contract/contract-address.json)

Set the admin address used to deploy the contract:

```ts
export const ADMIN_ADDRESS = "0x77C037fbF42e85dB1487B390b08f58C00f438812";
```

You can find the admin address here: [`app/src/constants/admin-address.ts`](./app/src/constants/admin-address.ts)

---

## 💻 Run Frontend Locally

```bash
npm run dev
```

Access at: [http://localhost:3000](http://localhost:3000)

---

## 🔍 Subgraph Query

Query payments by ID using GraphQL:

```ts
//app/src/constants/subgraph-url.ts
export const SUBGRAPH_URL =
	"https://api.studio.thegraph.com/query/95824/tuition-escrow/version/latest";
```

---

## 🧪 Full Workflow

Run the entire setup, test, deploy, and frontend build:

```bash
npm run full:deploy
```

---

## 📄 Contract Interfaces

The contract Application Binary Interfaces (ABIs) can be accessed in two locations:

1. Complete contract artifacts including ABIs are available in `contracts/out/`:

   - [`TuitionEscrow.sol/TuitionEscrow.json`](./contracts/out/TuitionEscrow.sol/TuitionEscrow.json)
   - [`MockToken.sol/MockToken.json`](./contracts/out/MockToken.sol/MockToken.json)

2. Extracted ABI definitions for frontend use are located in `app/src/abi/`:

   - [`TuitionEscrowABI.ts`](./app/src/abi/TuitionEscrowABI.ts)
   - [`MockTokenABI.ts`](./app/src/abi/MockTokenABI.ts)

     These files contain the interface definitions needed for interacting with the deployed smart contracts.

---

## 🤝 Assumptions & Assignment Details

This project was created as part of a take-home exam. For full assignment details, see:
[Take-home Exam Requirements](https://learned-balaur-a70.notion.site/Take-home-Exam-web3-20058c1b527580d8aff5cf08806b101d)

Key assumptions for this implementation:

- **Payment Initialization**: Any user can initialize a payment by specifying the payer, university, amount and invoice reference. This creates a unique payment ID for tracking.
- **Payment Handling**: Deposits, refunds, and releases are tracked by `paymentId`.
- **Subgraph**: Used to query on-chain data.
- **Testnet**: Arbitrum Sepolia for low-cost deployment.
- **Frontend**: Requires Wallet Extension on Arbitrum Sepolia
- **Security**: `.env` file is ignored and should not be committed.

---

## 🎥 Video Walkthrough

> A 3–5 minute video covering contract, frontend demo, and subgraph queries.  
> [Watch the demo video](https://youtu.be/276fG23WMoA)

---

## 📦 Deliverables

- ✅ GitHub Repo: https://github.com/amrrobb/tuition-escrow
- ✅ Contracts deployed to Arbitrum Sepolia
- ✅ Full test suite under `contracts/test/`
- ✅ Setup instructions, addresses, ABI, and assumptions
- ✅ (Optional) Vercel frontend deployment
- ✅ Video walkthrough
