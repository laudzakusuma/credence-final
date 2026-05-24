import { commitmentHash, nowIso, randomId, sha256Hex } from "@/lib/crypto";

export type SalesRecord = {
  id: string;
  source: "tokopedia" | "shopee" | "lazada" | "bank" | "manual";
  amount: number;
  currency: "IDR" | "USD";
  timestamp: string;
  customerHash: string;
};

export type ProofCriteria = {
  minRevenue: number;
  minGrowth: number;
  periodDays: number;
  currency: "IDR" | "USD";
};

export type CredenceProof = {
  proofId: string;
  merchantCommitment: string;
  dataCommitment: string;
  proofCommitment: string;
  network: "Midnight";
  payoutRail: "Stellar USDC";
  criteria: ProofCriteria;
  result: {
    verified: boolean;
    revenueThresholdMet: boolean;
    growthThresholdMet: boolean;
    rawRevenueHidden: true;
    rawTransactionsHidden: true;
    customerDataHidden: true;
  };
  publicSignals: {
    statement: string;
    periodDays: number;
    currency: string;
    generatedAt: string;
  };
  privateMetadata: {
    recordCount: number;
    sources: string[];
  };
  issuedAt: string;
  signature: string;
};

export const demoSalesRecords: SalesRecord[] = [
  {
    id: "sale_001",
    source: "tokopedia",
    amount: 5200000,
    currency: "IDR",
    timestamp: "2026-01-05T10:15:00.000Z",
    customerHash: sha256Hex("customer-a"),
  },
  {
    id: "sale_002",
    source: "shopee",
    amount: 6700000,
    currency: "IDR",
    timestamp: "2026-02-10T09:22:00.000Z",
    customerHash: sha256Hex("customer-b"),
  },
  {
    id: "sale_003",
    source: "tokopedia",
    amount: 8400000,
    currency: "IDR",
    timestamp: "2026-03-12T14:01:00.000Z",
    customerHash: sha256Hex("customer-c"),
  },
  {
    id: "sale_004",
    source: "lazada",
    amount: 11200000,
    currency: "IDR",
    timestamp: "2026-04-20T16:45:00.000Z",
    customerHash: sha256Hex("customer-d"),
  },
  {
    id: "sale_005",
    source: "bank",
    amount: 15800000,
    currency: "IDR",
    timestamp: "2026-05-08T11:10:00.000Z",
    customerHash: sha256Hex("customer-e"),
  },
];

export function calculateRevenue(records: SalesRecord[]) {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

export function calculateGrowth(records: SalesRecord[]) {
  if (records.length < 2) return 0;

  const midpoint = Math.floor(records.length / 2);
  const previous = records.slice(0, midpoint);
  const current = records.slice(midpoint);

  const previousRevenue = calculateRevenue(previous);
  const currentRevenue = calculateRevenue(current);

  if (previousRevenue === 0) return 0;

  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}

export function createCredenceProof(input: {
  merchantName: string;
  records: SalesRecord[];
  criteria: ProofCriteria;
}) {
  const { merchantName, records, criteria } = input;

  const totalRevenue = calculateRevenue(records);
  const growth = calculateGrowth(records);

  const revenueThresholdMet = totalRevenue >= criteria.minRevenue;
  const growthThresholdMet = growth >= criteria.minGrowth;
  const verified = revenueThresholdMet && growthThresholdMet;

  const merchantCommitment = commitmentHash({
    merchantName,
    salt: "credence-merchant-salt",
  });

  const dataCommitment = commitmentHash({
    records,
    salt: "credence-private-sales-data",
  });

  const proofCommitment = commitmentHash({
    merchantCommitment,
    dataCommitment,
    criteria,
    result: {
      revenueThresholdMet,
      growthThresholdMet,
    },
    totalRevenuePrivate: totalRevenue,
    growthPrivate: growth,
    salt: "credence-proof-salt",
  });

  const issuedAt = nowIso();

  const proof: Omit<CredenceProof, "signature"> = {
    proofId: randomId("proof"),
    merchantCommitment,
    dataCommitment,
    proofCommitment,
    network: "Midnight",
    payoutRail: "Stellar USDC",
    criteria,
    result: {
      verified,
      revenueThresholdMet,
      growthThresholdMet,
      rawRevenueHidden: true,
      rawTransactionsHidden: true,
      customerDataHidden: true,
    },
    publicSignals: {
      statement:
        "Merchant satisfies selected credit criteria without disclosing raw transaction records.",
      periodDays: criteria.periodDays,
      currency: criteria.currency,
      generatedAt: issuedAt,
    },
    privateMetadata: {
      recordCount: records.length,
      sources: Array.from(new Set(records.map((record) => record.source))),
    },
    issuedAt,
  };

  return {
    ...proof,
    signature: commitmentHash({
      proof,
      signer: "credence-demo-verifier",
    }),
  };
}

export function verifyCredenceProof(proof: CredenceProof) {
  if (!proof.proofId) return false;
  if (!proof.merchantCommitment.startsWith("0x")) return false;
  if (!proof.dataCommitment.startsWith("0x")) return false;
  if (!proof.proofCommitment.startsWith("0x")) return false;
  if (proof.network !== "Midnight") return false;

  const expectedSignature = commitmentHash({
    proof: {
      proofId: proof.proofId,
      merchantCommitment: proof.merchantCommitment,
      dataCommitment: proof.dataCommitment,
      proofCommitment: proof.proofCommitment,
      network: proof.network,
      payoutRail: proof.payoutRail,
      criteria: proof.criteria,
      result: proof.result,
      publicSignals: proof.publicSignals,
      privateMetadata: proof.privateMetadata,
      issuedAt: proof.issuedAt,
    },
    signer: "credence-demo-verifier",
  });

  return expectedSignature === proof.signature && proof.result.verified;
}