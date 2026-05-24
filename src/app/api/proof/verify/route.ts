import { NextResponse } from "next/server";
import {
  CredenceProof,
  verifyCredenceProof,
} from "@/lib/credence-proof";

type Body = {
  proof?: CredenceProof;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!body.proof) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing proof payload",
        },
        { status: 400 }
      );
    }

    const verified = verifyCredenceProof(body.proof);

    return NextResponse.json({
      ok: true,
      verified,
      result: {
        eligible: verified,
        network: body.proof.network,
        payoutRail: body.proof.payoutRail,
        criteria: body.proof.criteria,
        publicSignals: body.proof.publicSignals,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify Credence proof",
      },
      { status: 500 }
    );
  }
}