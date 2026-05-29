# Credence

**Private credit passport infrastructure for APAC MSMEs.**

Credence helps micro, small, and medium enterprises prove creditworthiness to banks and lenders without exposing raw sales records, customer identities, exact revenue, or sensitive business data.

Live demo: https://credence-six-zeta.vercel.app

---

## Overview

Many MSMEs in Asia Pacific already have strong business signals from marketplaces, bank statements, e-wallet flows, invoices, and trade activity. However, they often struggle to access formal financing because lenders require trusted financial records, while businesses are reluctant to share sensitive raw data.

Credence solves this by turning private business records into a **verifiable credit passport**.

Instead of sending raw sales rows to a lender, an MSME can prove statements such as:

- Revenue is above a selected threshold.
- Growth is above a selected percentage.
- Raw transaction rows remain hidden.
- Customer identities remain hidden.
- Lenders can verify eligibility instantly.
- Approved loans can be disbursed through Stellar testnet payments.

Credence combines privacy-preserving credit verification with real payment settlement infrastructure.

---

## Problem

Traditional MSME lending workflows often require businesses to expose too much data.

A lender may ask for:

- full bank statements
- marketplace sales exports
- customer names
- order details
- exact revenue numbers
- product-level sales data
- personal transactions mixed with business activity

This creates major problems:

- MSMEs do not want competitors, lenders, or third parties to see sensitive business data.
- Manual PDF or spreadsheet verification is slow and easy to fake.
- Lenders struggle to verify fragmented sales history.
- Businesses with real revenue still fail to access formal credit.
- Many MSMEs end up relying on informal lenders with expensive borrowing terms.

Credence provides a privacy-first alternative.

---

## Solution

Credence creates a **private credit passport** for MSMEs.

The MSME selects lending criteria, such as minimum revenue, growth percentage, and reporting period. Credence then generates a proof package that allows a lender to verify whether the MSME satisfies the criteria without seeing the underlying sales data.

The lender receives:

- proof ID
- selected lending criteria
- commitment hash
- verification result
- privacy audit trail
- payout rail information

The lender does not receive:

- raw sales rows
- customer names
- exact revenue
- exact growth calculation
- product details
- private bank activity

---

## Key Features

- MSME dashboard for credit readiness
- Private credit passport generation
- Animated private proof engine
- QR proof payload
- Bank verifier portal
- Verifier audit log
- Midnight Compact smart contract for proof commitments
- Real Stellar testnet payout flow
- Light and dark mode UI
- Contract deployment card
- Privacy-first user experience

---

## Demo Flow

1. **Landing Page**  
   Explains Credence as private credit infrastructure for MSMEs.

2. **MSME Dashboard**  
   Shows private revenue readiness, growth, proof abilities, and Midnight contract deployment information.

3. **Generate Proof**  
   The MSME selects minimum revenue, minimum growth, and period length.

   Credence then runs a private proof flow:
   - reading private sales signals
   - creating a data commitment
   - generating a proof commitment
   - preparing a bank-verifiable QR package

4. **Bank Verifier Portal**  
   The lender receives a proof payload and verifies it without seeing raw business records.

5. **Verifier Audit Trail**  
   The bank sees what was verified:
   - proof payload parsed
   - Midnight commitment detected
   - revenue threshold verified
   - growth requirement verified
   - customer identities exposed: 0
   - raw transaction rows exposed: 0

6. **Stellar Testnet Payout**  
   Once verified, the lender can submit a real Stellar testnet payout to the MSME wallet.

---

## Midnight Integration

Credence includes a Midnight Compact smart contract that registers privacy-preserving credit passport commitments.

### Contract Source

```txt
midnight-contract/contracts/credence.compact
```

### Contract Circuits

```txt
registerCreditPassport
updateVerificationStatus
revokeCreditPassport
```

### What the Contract Stores

The contract stores only public commitments and proof status:

- proof ID hash
- merchant commitment
- private data commitment
- criteria commitment
- proof commitment
- verification status
- payout rail
- last updated timestamp

### What the Contract Never Stores

The contract does not store:

- raw sales records
- exact revenue
- exact growth percentage
- customer names
- order IDs
- product details
- private bank transactions

---

## Midnight Deployment Status

Credence validates its Midnight integration through a Compact smart contract deployed on a **Midnight local devnet** using the official Midnight toolchain in GitHub Codespaces.

The local deployment validated:

- Compact compiler
- proof server
- Midnight node
- indexer
- wallet setup
- contract deployment
- contract interaction through CLI

### Local Devnet Contract Address

```txt
8e66c029ebbb9284b29964e71568162e2230f26579b4179a4887f46be58ff273
```

### Deployer

```txt
mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s
```

### Deployment Notes

```txt
docs/midnight-deployment.md
```

Note: the current Midnight deployment is a local devnet deployment, not a public Preprod deployment.

---

## Stellar Integration

Credence includes a **real Stellar testnet payout flow**.

After a lender verifies the credit passport, the bank portal can submit a Stellar testnet payment from a server-side source account to the MSME destination wallet.

The Stellar source secret is stored only as a server-side environment variable and is never exposed to the frontend.

### Stellar Flow

```txt
Verified proof
→ lender approves payout
→ Vercel API route signs transaction server-side
→ Stellar testnet transaction submitted
→ transaction hash returned to UI
```

### Server Route

```txt
src/app/api/stellar/payout/route.ts
```

### Required Server-Side Environment Variables

```env
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_SOURCE_SECRET=YOUR_STELLAR_TESTNET_SECRET_KEY
```

The destination wallet entered in the UI must be a funded Stellar testnet public key starting with `G`.

---

## Architecture

```txt
┌─────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                     │
│  Landing Page | MSME Dashboard | Generate Proof | Bank Portal│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                       │
│  /api/proof/generate | /api/proof/verify | /api/stellar/payout│
└─────────────────────────────────────────────────────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│       Midnight Contract       │   │        Stellar Testnet         │
│  Compact proof commitments    │   │  Server-side signed payout    │
│  Local devnet deployment      │   │  Real testnet transaction     │
└───────────────────────────────┘   └───────────────────────────────┘
```

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons
- QR proof payload

### Backend

- Next.js API routes
- TypeScript proof simulator
- proof generation API
- proof verification API
- real Stellar testnet payout API

### Smart Contract

- Midnight Compact
- local Midnight devnet
- proof server
- node
- indexer
- wallet CLI

### Payments

- Stellar SDK
- Stellar testnet
- server-side transaction signing
- Vercel environment variables

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
│   │       ├── proof/
│   │       └── stellar/
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

## Running Locally

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

Build production:

```bash
pnpm build
```

---

## Environment Variables

For local development, create:

```txt
.env.local
```

Example:

```env
NEXT_PUBLIC_APP_NAME=Credence

NEXT_PUBLIC_MIDNIGHT_NETWORK=Midnight Local Devnet
NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS=8e66c029ebbb9284b29964e71568162e2230f26579b4179a4887f46be58ff273
NEXT_PUBLIC_MIDNIGHT_DEPLOYER=mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s
NEXT_PUBLIC_MIDNIGHT_DEPLOYED_AT=2026-05-25T02:09:14.516Z

STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_SOURCE_SECRET=YOUR_STELLAR_TESTNET_SECRET_KEY
```

Do not commit `.env.local`.

---

## Running the Midnight Contract Locally

Go to the Midnight contract folder:

```bash
cd midnight-contract
```

Start local services:

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

## Deployment

### Web App

The web app is deployed on Vercel:

```txt
https://credence-six-zeta.vercel.app
```

### Backend

The backend API routes run as Vercel serverless functions:

```txt
/api/proof/generate
/api/proof/verify
/api/stellar/payout
```

### Midnight Contract

The Midnight contract is deployed separately through the Midnight toolchain, not through Vercel.

Current contract status:

```txt
Midnight local devnet deployment validated
```

### Stellar

The Stellar payout route submits real testnet transactions using a server-side secret stored in Vercel environment variables.

---

## Why Credence Matters

Credence helps MSMEs access credit without sacrificing business privacy.

It gives lenders a way to verify underwriting criteria while protecting the borrower’s most sensitive commercial data.

This is especially relevant for APAC markets, where many MSMEs have real sales activity but lack formal credit history or do not want to expose full business records to lenders.

---

## Hackathon Status

Implemented:

- Next.js frontend
- dashboard
- proof generation flow
- bank verifier portal
- verifier audit trail
- QR proof payload
- Midnight Compact contract
- Midnight local devnet deployment
- real Stellar testnet payout
- Vercel deployment

Future improvements:

- deploy Midnight contract to public Preprod
- integrate real marketplace APIs
- support real USDC asset trustlines
- add lender identity and permissions
- add credit circle attestations
- improve production-grade ZK proof generation
- add repayment history proofs

---

## Tagline

**Credence lets MSMEs prove they are creditworthy without exposing raw business data.**
