import {
  createCredenceProof,
  demoSalesRecords,
} from "../../src/lib/credence-proof";

export type CredenceWitnessInput = {
  merchantName: string;
  minRevenue: number;
  minGrowth: number;
  periodDays: number;
};

export function createCredenceWitness(input: CredenceWitnessInput) {
  return createCredenceProof({
    merchantName: input.merchantName,
    records: demoSalesRecords,
    criteria: {
      minRevenue: input.minRevenue,
      minGrowth: input.minGrowth,
      periodDays: input.periodDays,
      currency: "IDR",
    },
  });
}