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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  destination?: string;
  amount?: number;
};

function safeError(error: unknown) {
  if (error instanceof Error) return error.message;

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Stellar payout error";
  }
}

function getServer() {
  const horizonUrl =
    process.env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

  return new Horizon.Server(horizonUrl);
}

function getSourceKeypair() {
  const sourceSecret = process.env.STELLAR_SOURCE_SECRET;

  if (!sourceSecret) {
    throw new Error("Missing STELLAR_SOURCE_SECRET environment variable");
  }

  if (!sourceSecret.startsWith("S")) {
    throw new Error("STELLAR_SOURCE_SECRET must start with S");
  }

  return Keypair.fromSecret(sourceSecret);
}

export async function GET() {
  try {
    const server = getServer();
    const sourceKeypair = getSourceKeypair();
    const sourcePublicKey = sourceKeypair.publicKey();

    try {
      const account = await server.loadAccount(sourcePublicKey);

      return NextResponse.json({
        ok: true,
        env: {
          stellarNetwork: process.env.STELLAR_NETWORK ?? "testnet",
          horizonUrl:
            process.env.STELLAR_HORIZON_URL ??
            "https://horizon-testnet.stellar.org",
          sourceSecretConfigured: Boolean(process.env.STELLAR_SOURCE_SECRET),
        },
        source: {
          publicKey: sourcePublicKey,
          active: true,
          balances: account.balances,
        },
      });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Source account is not active on Stellar testnet. Fund the source public key with Friendbot.",
          source: {
            publicKey: sourcePublicKey,
            active: false,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: safeError(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!body.destination) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing destination Stellar public key",
        },
        { status: 400 }
      );
    }

    if (!body.destination.startsWith("G")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Destination must be a Stellar public key starting with G",
        },
        { status: 400 }
      );
    }

    if (!body.amount || Number.isNaN(body.amount) || body.amount <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payout amount",
        },
        { status: 400 }
      );
    }

    if (body.amount > 25) {
      return NextResponse.json(
        {
          ok: false,
          error: "Demo payout limit is 25 XLM. Use a smaller amount.",
        },
        { status: 400 }
      );
    }

    const server = getServer();
    const sourceKeypair = getSourceKeypair();
    const sourcePublicKey = sourceKeypair.publicKey();

    let sourceAccount;

    try {
      sourceAccount = await server.loadAccount(sourcePublicKey);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Source account not found on Stellar testnet. Fund the source public key with Friendbot.",
          sourcePublicKey,
        },
        { status: 500 }
      );
    }

    try {
      await server.loadAccount(body.destination);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Destination account not found on Stellar testnet. Fund the destination public key with Friendbot first.",
          destination: body.destination,
        },
        { status: 400 }
      );
    }

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
        source: sourcePublicKey,
        txHash: submitted.hash,
        status: "success",
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${submitted.hash}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: safeError(error),
      },
      { status: 500 }
    );
  }
}