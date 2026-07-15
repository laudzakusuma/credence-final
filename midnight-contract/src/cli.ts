/**
 * CLI for interacting with Credence Midnight contract
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/compact-js';

import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import {
  createWallet,
  persistWalletState,
  unshieldedToken,
  type WalletContext,
} from './wallet';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'credence');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Credence contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const Credence = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('credence', Credence.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

function decodeOpaqueString(value: unknown) {
  try {
    return Buffer.from(value as Buffer | Uint8Array).toString();
  } catch {
    return String(value ?? '');
  }
}

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword =
    process.env.PRIVATE_STATE_PASSWORD?.trim() ||
    'Local-Devnet-Development-Placeholder-1';

  const state = await walletCtx.wallet.waitForSyncedState();

  const walletProvider = {
    getCoinPublicKey: () => state.shielded.coinPublicKey.toHexString(),
    getEncryptionPublicKey: () => state.shielded.encryptionPublicKey.toHexString(),

    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        {
          shieldedSecretKeys: walletCtx.shieldedSecretKeys,
          dustSecretKey: walletCtx.dustSecretKey,
        },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );

      const signedRecipe = await walletCtx.wallet.signRecipe(recipe, (payload) =>
        walletCtx.unshieldedKeystore.signData(payload),
      );

      return walletCtx.wallet.finalizeRecipe(signedRecipe);
    },

    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'credence-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(
      networkConfig.indexer,
      networkConfig.indexerWS,
    ),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     Credence Contract CLI                   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);

  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run deploy\` first.`);
    process.exit(1);
  }

  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network:  ${network}\n`);

  try {
    console.log('  Connecting to wallet...');
    const walletCtx = await createWallet({
      network,
      networkConfig,
      seed: SEED,
    });

    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;

    if (restoredCount > 0) {
      console.log(
        `  Restored ${restoredCount}/3 child wallets from .midnight-wallet-state — sync will resume from saved point.`,
      );
    }

    console.log('  Syncing with network...');
    console.log('  ℹ  This may take several minutes depending on network size.');
    console.log('     RPC disconnection messages during sync are normal and can be safely ignored.\n');

    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Still syncing... (${elapsed}s elapsed)   `);
    }, 5000);

    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);

    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

    if (balance === 0n && network !== 'undeployed' && networkConfig.faucet) {
      const address = walletCtx.unshieldedKeystore.getBech32Address();
      console.log('  ⚠ Wallet has no tNight. Fund it from the faucet to send transactions:');
      console.log(`     ${networkConfig.faucet}`);
      console.log(`     Wallet address: ${address}\n`);
    }

    console.log('  Connecting to Credence contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
    });

    console.log('  ✅ Connected!\n');

    let running = true;

    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Register credit passport proof');
      console.log('  2. Read current credit passport proof');
      console.log('  3. Update verification status');
      console.log('  4. Revoke credit passport');
      console.log('  5. Check wallet balance');
      console.log('  6. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n  Registering Credence proof commitment...\n');

          const defaultProofIdHash = `proof_${Date.now()}`;
          const defaultMerchantCommitment = '0xmerchant_nusantara_craft_co';
          const defaultDataCommitment = '0xprivate_sales_data_commitment';
          const defaultCriteriaCommitment = '0xcriteria_revenue_growth_commitment';
          const defaultProofCommitment = '0xzk_credit_passport_commitment';
          const defaultVerificationStatus = 'VERIFIED';
          const defaultPayoutRail = 'STELLAR_USDC';
          const defaultUpdatedAt = new Date().toISOString();

          const proofIdHash =
            (await rl.question(`  Credit Passport ID hash [${defaultProofIdHash}]: `)) ||
            defaultProofIdHash;

          const merchantCommitment =
            (await rl.question(`  Merchant commitment [${defaultMerchantCommitment}]: `)) ||
            defaultMerchantCommitment;

          const dataCommitment =
            (await rl.question(`  Data commitment [${defaultDataCommitment}]: `)) ||
            defaultDataCommitment;

          const criteriaCommitment =
            (await rl.question(`  Criteria commitment [${defaultCriteriaCommitment}]: `)) ||
            defaultCriteriaCommitment;

          const proofCommitment =
            (await rl.question(`  Proof commitment [${defaultProofCommitment}]: `)) ||
            defaultProofCommitment;

          const verificationStatus =
            (await rl.question(`  Verification status [${defaultVerificationStatus}]: `)) ||
            defaultVerificationStatus;

          const payoutRail =
            (await rl.question(`  Payout rail [${defaultPayoutRail}]: `)) ||
            defaultPayoutRail;

          const updatedAt =
            (await rl.question(`  Updated at [${defaultUpdatedAt}]: `)) ||
            defaultUpdatedAt;

          console.log('\n  Submitting transaction. This may take 30-60 seconds...\n');

          try {
            const tx = await deployed.callTx.registerCreditPassport(
              proofIdHash,
              merchantCommitment,
              dataCommitment,
              criteriaCommitment,
              proofCommitment,
              verificationStatus,
              payoutRail,
              updatedAt,
            );

            console.log('  ✅ Credit passport registered!');
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height:   ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }

          break;
        }

        case '2': {
          console.log('\n  Reading Credence proof from blockchain...\n');

          try {
            const contractState = await providers.publicDataProvider.queryContractState(
              deployment.address,
            );

            if (!contractState) {
              console.log('  📋 No proof found. Contract state is empty.\n');
              break;
            }

            const ledgerState = Credence.ledger(contractState.data);

            console.log('  📋 Current credit passport proof\n');
            console.log(`  Credit Passport ID Hash:        ${decodeOpaqueString(ledgerState.proofIdHash)}`);
            console.log(`  Merchant Commitment:  ${decodeOpaqueString(ledgerState.merchantCommitment)}`);
            console.log(`  Data Commitment:      ${decodeOpaqueString(ledgerState.dataCommitment)}`);
            console.log(`  Criteria Commitment:  ${decodeOpaqueString(ledgerState.criteriaCommitment)}`);
            console.log(`  Proof Commitment:     ${decodeOpaqueString(ledgerState.proofCommitment)}`);
            console.log(`  Status:               ${decodeOpaqueString(ledgerState.verificationStatus)}`);
            console.log(`  Payout Rail:          ${decodeOpaqueString(ledgerState.payoutRail)}`);
            console.log(`  Last Updated At:      ${decodeOpaqueString(ledgerState.lastUpdatedAt)}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }

          break;
        }

        case '3': {
          const defaultStatus = 'VERIFIED';
          const defaultUpdatedAt = new Date().toISOString();

          const status =
            (await rl.question(`  New status [${defaultStatus}]: `)) || defaultStatus;

          const updatedAt =
            (await rl.question(`  Updated at [${defaultUpdatedAt}]: `)) ||
            defaultUpdatedAt;

          console.log('\n  Updating verification status...\n');

          try {
            const tx = await deployed.callTx.updateVerificationStatus(status, updatedAt);

            console.log('  ✅ Verification status updated!');
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height:   ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }

          break;
        }

        case '4': {
          const defaultStatus = 'REVOKED';
          const defaultUpdatedAt = new Date().toISOString();

          const revokedStatus =
            (await rl.question(`  Revoked status [${defaultStatus}]: `)) ||
            defaultStatus;

          const updatedAt =
            (await rl.question(`  Updated at [${defaultUpdatedAt}]: `)) ||
            defaultUpdatedAt;

          console.log('\n  Revoking credit passport...\n');

          try {
            const tx = await deployed.callTx.revokeCreditPassport(revokedStatus, updatedAt);

            console.log('  ✅ Credit passport revoked!');
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height:   ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }

          break;
        }

        case '5': {
          console.log('\n  Checking balance...\n');

          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance =
            currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());

          console.log(`  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST:   ${dustBalance.toLocaleString()}\n`);

          break;
        }

        case '6': {
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;
        }

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-6.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);