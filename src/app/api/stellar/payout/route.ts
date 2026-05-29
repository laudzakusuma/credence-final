import { NextResponse } from "next/server";
import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

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

    const sourceSecret = process.env.STELLAR_SOURCE_SECRET;
    const horizonUrl =
      process.env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

    if (!sourceSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing STELLAR_SOURCE_SECRET environment variable",
        },
        { status: 500 }
      );
    }

    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const server = new Horizon.Server(horizonUrl);

    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const amount = body.amount.toFixed(2);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: body.destination,
          asset: Asset.native(),
          amount,
        })
      )
      .setTimeout(60)
      .build();

    transaction.sign(sourceKeypair);

    const submitted = await server.submitTransaction(transaction);

    return NextResponse.json({
      ok: true,
      payout: {
        network: "Stellar Testnet",
        asset: "XLM",
        amount: Number(amount),
        destination: body.destination,
        source: sourceKeypair.publicKey(),
        txHash: submitted.hash,
        status: "success",
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${submitted.hash}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit Stellar testnet payout",
      },
      { status: 500 }
    );
  }
}