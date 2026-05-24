import { NextResponse } from "next/server";
import {
  createCredenceProof,
  demoSalesRecords,
  ProofCriteria,
  SalesRecord,
} from "@/lib/credence-proof";

type Body = {
  merchantName?: string;
  records?: SalesRecord[];
  criteria?: ProofCriteria;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const merchantName = body.merchantName ?? "Nusantara Craft Co.";

    const records =
      body.records && body.records.length > 0 ? body.records : demoSalesRecords;

    const criteria: ProofCriteria = body.criteria ?? {
      minRevenue: 10000000,
      minGrowth: 20,
      periodDays: 120,
      currency: "IDR",
    };

    const proof = createCredenceProof({
      merchantName,
      records,
      criteria,
    });

    return NextResponse.json({
      ok: true,
      proof,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate Credence proof",
      },
      { status: 500 }
    );
  }
}