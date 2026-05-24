# Credence Midnight Contract Layer

Credence uses Midnight as the private verification layer for MSME credit passports.

## Privacy model

Raw sales data is never submitted publicly.

Instead, the app computes:

- merchant commitment
- private sales data commitment
- proof commitment
- selected public criteria

The lender only sees:

- criteria
- proof status
- commitment hash
- proof signature
- public verification result

## Contract responsibilities

The Midnight contract layer is designed to:

1. Register proof commitments.
2. Store public proof metadata.
3. Verify that a proof commitment exists.
4. Prevent raw sales data exposure.
5. Act as the privacy-preserving source of truth for bank verification.

## Demo mode

The current frontend/backend uses a TypeScript proof simulator to model the full flow while the Compact contract is prepared for integration.

The production flow should replace the simulator with Compact-generated proof calls and a Midnight proof server.