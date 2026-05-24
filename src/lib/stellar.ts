import { randomId } from "@/lib/crypto";

export type StellarPayoutRequest = {
  destination: string;
  amount: number;
  asset: "USDC";
};

export type StellarPayoutResult = {
  network: "Stellar Testnet";
  asset: "USDC";
  amount: number;
  destination: string;
  txHash: string;
  status: "success";
  explorerUrl: string;
};

export function simulateStellarPayout(
  input: StellarPayoutRequest
): StellarPayoutResult {
  const txHash = randomId("stellar_tx");

  return {
    network: "Stellar Testnet",
    asset: input.asset,
    amount: input.amount,
    destination: input.destination,
    txHash,
    status: "success",
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
  };
}