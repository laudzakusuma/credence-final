# Credence

**Private Credit Passport infrastructure for APAC MSMEs.**

Credence helps micro, small, and medium enterprises prove creditworthiness to banks and lenders without exposing raw sales records, customer identities, exact revenue, or sensitive business data.

Live demo: https://credence-six-zeta.vercel.app

Video Demo: https://youtu.be/SJRESPHn2ZM?si=PZ2RcXtHMyAklePC

Another: https://drive.google.com/drive/folders/1_zOBP4FzmWs30a9PChQm6iJJ8qqmYyKT?usp=sharing

---

## Overview

Many MSMEs in Asia Pacific already generate strong business signals through marketplaces, bank statements, e-wallet flows, invoices, and trade activity. However, they often struggle to access formal financing: lenders require trusted financial records, while businesses are reluctant to share sensitive raw data.

Credence resolves this by evaluating private business signals against a lender's underwriting policy and issuing the result as a **Credit Passport** — a privacy-preserving artifact a lender can verify without ever seeing the underlying data.

Instead of sending raw sales rows to a lender, an MSME's business signals are evaluated so a lender can confirm statements such as:

- Revenue meets the lender's minimum revenue requirement.
- Growth meets the lender's minimum growth requirement.
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

Credence issues a **Credit Passport** for each MSME.

The lender defines underwriting criteria — minimum revenue requirement, minimum growth requirement, and evaluation period. Credence evaluates the MSME's private business signals against that policy and produces a Credit Passport that lets the lender verify eligibility without seeing the underlying sales data.

The lender receives:

- Credit Passport ID
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
- Private Credit Passport generation
- Animated Credit Passport generation flow
- QR Credit Passport payload
- Bank verifier portal
- Verifier audit log
- Midnight Compact smart contract for private Credit Passport commitments
- Stellar Soroban testnet registry contract
- Real Stellar testnet payout flow
- Light and dark mode UI
- Contract deployment card
- Privacy-first user experience

---

## Product Flow

```txt
Business Dataset
  ↓
Business Signal Extraction
  ↓
Lender Underwriting Policy
  ↓
Privacy Evaluation
  ↓
Credit Passport Generation
  ↓
Bank Verification
  ↓
Stellar Testnet Payout
```

The lender's underwriting policy (minimum revenue requirement, minimum growth requirement, evaluation period) is not business data — it is the criteria Credence evaluates business signals against. Credence never asks the MSME to manually declare its own revenue as a criterion; the MSME's private signals are evaluated against the lender's policy.

---

## Demo Flow

1. **Landing Page**
   Explains Credence as private Credit Passport infrastructure for MSMEs.

2. **MSME Dashboard**
   Shows private revenue readiness, growth, Credit Passport eligibility, and Midnight contract deployment information.

3. **Generate Credit Passport**
   In this demo, the lender's underwriting policy — minimum revenue requirement, minimum growth requirement, and evaluation period — is configured directly in the app to simulate a lender's requirements.

   Credence then runs a private evaluation flow:
   - importing the marketplace transaction dataset (demo data; live marketplace API integration is a planned future improvement)
   - extracting business signals
   - evaluating signals against the configured lender underwriting policy
   - creating a data commitment and a proof commitment
   - preparing a bank-verifiable Credit Passport package (QR-encoded)

4. **Bank Verifier Portal**
   The lender receives the Credit Passport and verifies it without seeing raw business records.

5. **Verifier Audit Trail**
   The bank sees what was verified:
   - Credit Passport parsed
   - Midnight commitment detected
   - revenue requirement verified against lender underwriting policy
   - growth requirement verified against lender underwriting policy
   - customer identities exposed: 0
   - raw transaction rows exposed: 0

6. **Stellar Soroban Registry**
   A verification reference can be anchored through the deployed Credence Registry contract on Stellar Testnet.

7. **Stellar Testnet Payout**
   Once verified, the lender can submit a real Stellar testnet payout to the MSME wallet.

---

## Midnight Integration

Credence includes a Midnight Compact smart contract that registers privacy-preserving Credit Passport commitments.

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

The contract stores only public commitments and Credit Passport status:

- Credit Passport ID hash
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

After a lender verifies the Credit Passport, the bank portal can submit a Stellar testnet payment from a server-side source account to the MSME destination wallet.

The Stellar source secret is stored only as a server-side environment variable and is never exposed to the frontend.

### Stellar Flow

```txt
Verified Credit Passport
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

NEXT_PUBLIC_STELLAR_CONTRACT_ID=CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
NEXT_PUBLIC_STELLAR_CONTRACT_LAB_URL=https://lab.stellar.org/r/testnet/contract/CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
```

The destination wallet entered in the UI must be a funded Stellar testnet public key starting with `G`.

---

## Stellar Soroban Testnet Contract

Credence includes a deployed **Stellar Soroban testnet registry contract** for privacy-preserving Credit Passport verification references.

### Contract Details

```txt
Network: Stellar Testnet
Contract Name: Credence Registry
Contract ID: CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
Lab Link: https://lab.stellar.org/r/testnet/contract/CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
Deploy Transaction: https://stellar.expert/explorer/testnet/tx/ad3155fb0cd724f16812ac7554180542f7a35e8de049542b237b491f5e0f4819
WASM Upload Transaction: https://stellar.expert/explorer/testnet/tx/76232e44c16d4f431bd38e6cb41c86f8db09ffb2a0d7ae13a3cebbec495f0f06
Deployer Address: GCLTZZCAB6ALGM2KDKCBRWVOBWD3676K7TONKFIN4NURFSUOYXXEZ3YF
WASM Hash: 2475443fcacd0fd7a879da2cf583fc08a4e4b42e81b232fb9e7907cbc5949719
Contract Source: stellar-contract/contracts/credence_registry/src/lib.rs
```

### Contract Purpose

The Credence Registry contract acts as a public Stellar testnet reference layer for MSME Credit Passport verification.

The contract does **not** store raw MSME business data. Instead, it stores privacy-preserving commitments and verification state that can be referenced by lenders after reviewing a borrower's Credit Passport.

This gives Credence a Stellar-native smart contract layer for:

- Credit Passport commitment registration
- lender verification references
- verification status updates
- payout reference tracking
- auditability without exposing raw borrower data

### Exported Functions

The deployed WASM exports three contract functions:

```txt
record_passport
get_passport
update_verification
```

### What the Soroban Contract Stores

The contract stores only verification references and commitments:

- Credit Passport ID commitment
- merchant hash
- private data commitment
- lending criteria commitment
- verification status
- payout reference

### What the Soroban Contract Never Stores

The contract does not store:

- raw sales records
- exact revenue
- exact growth percentage
- customer names
- order IDs
- product-level sales data
- private bank statements
- sensitive borrower documents

### Why Soroban Matters for Credence

Stellar provides the financial execution and settlement layer for Credence.

The Soroban contract turns Credence from a private credit scoring interface into a Stellar-native credit infrastructure prototype. After a lender verifies a Credit Passport, Credence can anchor a privacy-preserving verification reference on Stellar Testnet and connect that approved status to a Stellar payout flow.

In short:

```txt
Privacy-preserving Credit Passport
→ commitment-based verification
→ Soroban registry reference
→ Stellar testnet payout flow
→ MSME receives financing
```

---

## Architecture

```txt
┌─────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                     │
│ Landing Page | MSME Dashboard | Generate Credit Passport |   │
│                       Bank Portal                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                       │
│  /api/proof/generate | /api/proof/verify | /api/stellar/payout│
└─────────────────────────────────────────────────────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│   Midnight Contract   │ │ Stellar Soroban        │ │   Stellar Testnet      │
│ Compact commitments   │ │ Credence Registry      │ │ Server-side payout     │
│ Local devnet proof    │ │ Testnet contract ID    │ │ Real testnet tx        │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
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
- QR Credit Passport payload

### Backend

- Next.js API routes
- TypeScript proof/commitment simulator
- Credit Passport generation API (`/api/proof/generate`)
- Credit Passport verification API (`/api/proof/verify`)
- real Stellar testnet payout API (`/api/stellar/payout`)

### Smart Contract

- Midnight Compact
- local Midnight devnet
- proof server
- node
- indexer
- wallet CLI
- Stellar Soroban
- Rust
- WebAssembly/WASM
- Stellar CLI
- Stellar Testnet deployed contract

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
├── stellar-contract/
│   ├── contracts/
│   │   └── credence_registry/
│   │       └── src/
│   │           └── lib.rs
│   ├── Cargo.toml
│   └── README.md
├── docs/
│   └── midnight-deployment.md
└── README.md
```

Note: the `generate-proof/` route and `api/proof/` API folder are the underlying code paths for the Credit Passport generation and verification flow; only the user-facing terminology has changed.

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

NEXT_PUBLIC_STELLAR_CONTRACT_ID=CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
NEXT_PUBLIC_STELLAR_CONTRACT_LAB_URL=https://lab.stellar.org/r/testnet/contract/CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
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

## Running the Stellar Soroban Contract

Go to the Stellar contract folder:

```bash
cd stellar-contract
```

Build the Soroban contract:

```bash
stellar contract build
```

The optimized WASM output is generated at:

```txt
target/wasm32v1-none/release/credence_registry.wasm
```

Generate and fund a Stellar testnet deployer identity:

```bash
stellar keys generate credence_deployer --network testnet --fund
```

Deploy the contract to Stellar Testnet:

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/credence_registry.wasm \
  --source-account credence_deployer \
  --network testnet \
  --alias credence_registry
```

Current deployed contract:

```txt
CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
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

The Stellar payout route submits real testnet transactions once a lender approves a Credit Passport, using a server-side secret stored in Vercel environment variables.

### Stellar Soroban Contract

The Credence Registry contract is deployed on Stellar Testnet.

```txt
Contract ID: CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
Lab Link: https://lab.stellar.org/r/testnet/contract/CA6GNH3GORI6TK73F6F4OXQ7B3UGLXCZ4ZCVBEJDVZWHMSLPHX3E3E7A
Deploy Transaction: https://stellar.expert/explorer/testnet/tx/ad3155fb0cd724f16812ac7554180542f7a35e8de049542b237b491f5e0f4819
WASM Upload Transaction: https://stellar.expert/explorer/testnet/tx/76232e44c16d4f431bd38e6cb41c86f8db09ffb2a0d7ae13a3cebbec495f0f06
```

---

## Why Credence Matters

Credence helps MSMEs access credit without sacrificing business privacy.

It gives lenders a way to verify underwriting criteria while protecting the borrower's most sensitive commercial data through a single Credit Passport, rather than raw record exports.

This is especially relevant for APAC markets, where many MSMEs have real sales activity but lack formal credit history or do not want to expose full business records to lenders.

---

## Hackathon Status

Implemented:

- Next.js frontend
- dashboard
- Credit Passport generation flow
- bank verifier portal
- verifier audit trail
- QR Credit Passport payload
- Midnight Compact contract
- Midnight local devnet deployment
- Stellar Soroban testnet registry contract
- Stellar Testnet contract deployment
- real Stellar testnet payout
- Vercel deployment

Future improvements:

- connect frontend Credit Passport generation directly to Soroban contract invocation
- deploy Midnight contract to public Preprod
- integrate real marketplace APIs
- support real USDC asset trustlines
- add lender identity and permissions
- add credit circle attestations
- improve production-grade ZK proof generation
- add repayment history proofs

---

## Tagline

**Credence lets MSMEs prove they are creditworthy through a private Credit Passport — without exposing raw business data.**
