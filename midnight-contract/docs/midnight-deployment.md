# Credence Midnight Contract Deployment

Credence uses a Midnight Compact smart contract to register privacy-preserving credit passport commitments.

## Deployment

Network: Midnight local devnet through the official Midnight toolchain  
Contract address:

`8e66c029ebbb9284b29964e71568162e2230f26579b4179a4887f46be58ff273`

Deployer:

`mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s`

Deployed at:

`2026-05-25T02:09:14.516Z`

## Contract circuits

- `registerCreditPassport`
- `updateVerificationStatus`
- `revokeCreditPassport`

## Privacy design

The contract does not store raw sales data, customer names, order IDs, product details, exact revenue, or exact growth.

Instead, it stores:

- Credit Passport ID hash
- merchant commitment
- data commitment
- criteria commitment
- proof commitment
- verification status
- payout rail
- last updated timestamp

This supports selective disclosure: lenders can verify credit-passport eligibility without receiving raw business data.

## Deployment status

The Credence contract was compiled and deployed using the official Compact compiler, local Midnight node, indexer, wallet, and proof server inside GitHub Codespaces.

The local devnet deployment validates the full contract pipeline:

- compile
- proof generation infrastructure
- wallet setup
- contract deployment
- contract interaction through CLI