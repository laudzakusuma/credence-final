# Credence

**Private credit passport infrastructure for APAC MSMEs.**

Credence helps micro, small, and medium enterprises prove creditworthiness to banks and lenders without exposing raw sales records, customer identities, exact revenue, or sensitive business data.

The project combines:

- **Midnight Network** for privacy-preserving credit passport commitments
- **Zero-knowledge / selective disclosure design** for private eligibility proofs
- **Stellar USDC payout flow** for simulated loan disbursement
- **Next.js fullstack app** for MSME dashboards, proof generation, and lender verification

---

## Problem

Millions of MSMEs in Asia Pacific struggle to access formal financing because lenders require trusted financial records, while businesses are often unwilling or unable to share full private data.

Traditional lending workflows often require MSMEs to expose:

- full marketplace exports
- customer names
- order details
- exact sales numbers
- full bank statements
- personal transactions mixed with business transactions

This creates privacy risk, manual verification overhead, and limited access to credit.

---

## Solution

Credence turns fragmented business sales data into a **private credit passport**.

Instead of sending raw data to lenders, an MSME can prove statements such as:

- revenue is above a selected threshold
- growth is above a selected percentage
- customer data remains hidden
- raw transaction rows are not disclosed
- lender can verify eligibility instantly

The lender receives proof commitments and verification results, not raw business data.

---

## Demo Flow

1. **MSME Dashboard**  
   The business views revenue readiness and credit eligibility metrics.

2. **Generate Proof**  
   The MSME selects criteria such as minimum revenue, growth percentage, and period length.

3. **Private Proof Engine**  
   Credence simulates the private proof process:
   - hashing private sales records
   - creating a data commitment
   - generating a proof commitment
   - preparing a lender-verifiable QR payload

4. **Bank Verification Portal**  
   The lender verifies the proof and sees an audit trail showing what was verified and what remained hidden.

5. **Stellar USDC Payout Simulation**  
   If eligible, the lender can simulate loan disbursement through Stellar USDC.

---

## Midnight Integration

Credence includes a Compact smart contract that registers privacy-preserving credit passport commitments.

### Contract

```txt
midnight-contract/contracts/credence.compact
```

### Circuits

- `registerCreditPassport`
- `updateVerificationStatus`
- `revokeCreditPassport`

### Stored on-chain

The contract stores only public commitments and status:

- proof ID hash
- merchant commitment
- private data commitment
- criteria commitment
- proof commitment
- verification status
- payout rail
- last updated timestamp

### Never stored on-chain

- raw sales records
- exact revenue
- exact growth
- customer names
- order IDs
- product details
- private bank transactions

---

## Midnight Deployment Status

The Credence Compact contract was compiled and deployed on a **Midnight local devnet** using the official Midnight toolchain in GitHub Codespaces.

This validated the full local contract pipeline:

- Compact compiler
- proof server
- Midnight node
- indexer
- wallet setup
- contract deployment
- contract interaction through CLI

### Local devnet contract address

```txt
8e66c029ebbb9284b29964e71568162e2230f26579b4179a4887f46be58ff273
```

### Deployer

```txt
mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s
```

### Deployment notes

```txt
docs/midnight-deployment.md
```

---

## Stellar Integration

Credence includes a Stellar USDC payout simulation for the lender approval flow.

After a proof is verified, the bank portal can simulate a payout to an MSME Stellar wallet.

The current implementation simulates the payout transaction for demo purposes, while the architecture is designed to connect to Stellar testnet/mainnet payout flows.

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons
- QR code proof payload

### Backend

- Next.js API routes
- TypeScript proof simulator
- commitment hashing
- proof generation API
- proof verification API
- Stellar payout simulation API

### Smart Contract

- Midnight Compact
- local Midnight devnet
- proof server
- node
- indexer
- wallet CLI

---

## Project Structure

```txt
credence-final/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── generate-proof/
│   │   ├── bank/
│   │   └── api/
│   ├── components/
│   └── lib/
├── midnight-contract/
│   ├── contracts/
│   │   └── credence.compact
│   ├── src/
│   └── docs/
├── docs/
│   └── midnight-deployment.md
└── README.md
```

---

## Running the App

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

---

## Running Midnight Contract Locally

Go to the Midnight contract folder:

```bash
cd midnight-contract
```

Start local Midnight services:

```bash
npm run proof-server:start
```

Compile the Credence contract:

```bash
npm run compile
```

Deploy:

```bash
npm run deploy
```

Open the CLI:

```bash
npm run cli
```

---

## Key Features

- Private credit passport generation
- Selective disclosure proof simulation
- Midnight Compact contract for proof commitments
- Bank verifier portal
- Verifier audit trail
- QR proof payload
- Stellar USDC payout simulation
- Light and dark mode UI
- Animated proof generation flow

---

## Why Credence Matters

Credence allows lenders to make faster underwriting decisions while protecting MSME privacy.

It helps MSMEs prove that they are creditworthy without forcing them to expose sensitive commercial data.

This is especially relevant in APAC markets where MSMEs often rely on fragmented marketplace, bank, and trade data but lack formal credit histories.

---

## Status

Credence is a hackathon MVP.

Implemented:

- frontend demo
- proof generation flow
- bank verifier flow
- proof audit log
- Midnight Compact contract
- local Midnight devnet deployment
- Stellar payout simulation

Future improvements:

- deploy to Midnight Preprod
- integrate real marketplace APIs
- connect real Stellar testnet USDC payout
- implement production ZK proof generation
- add lender identity and role-based permissions
- add credit circle attestations
