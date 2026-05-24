import { NextResponse } from "next/server";
import { simulateStellarPayout } from "@/lib/stellar";

type Body = {
  destination?: string;
  amount?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!body.destination) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing destination Stellar address",
        },
        { status: 400 }
      );
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payout amount",
        },
        { status: 400 }
      );
    }

    const payout = simulateStellarPayout({
      destination: body.destination,
      amount: body.amount,
      asset: "USDC",
    });

    return NextResponse.json({
      ok: true,
      payout,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to simulate payout",
      },
      { status: 500 }
    );
  }
}