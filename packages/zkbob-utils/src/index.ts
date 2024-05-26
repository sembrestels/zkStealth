import { ZkBobClient, ProverMode, deriveSpendingKeyZkBob } from 'zkbob-client-js';
import md5 from 'js-md5';
import clientConfig from './config';
import { Mnemonic } from 'ethers/wallet';

export function getMessageToSign() {
    return 'Access zkBob account.\n\nOnly sign this message for a trusted client!';
}


export async function getZkBobClient(signedMessage: string): Promise<ZkBobClient> {

    const client = await ZkBobClient.create(clientConfig, 'WETH-optimism');
    let sigV = parseInt(signedMessage.slice(-2), 16);
    if (sigV < 27) {
      throw new Error("Invalid signature")
    }
    const newMnemonic = Mnemonic.entropyToPhrase(Uint8Array.from((md5 as any).array(signedMessage)));

    await client.login({
        sk: deriveSpendingKeyZkBob(newMnemonic),
        pool: 'WETH-optimism',
        birthindex: 0,
        proverMode: ProverMode.Local,
    })

    // now let's attach account generated from the arbitrary 12-words mnemonic:
    // const mnemonic = 'magic trophy foil direct marriage glad bench wash doctor risk end cheap';
    // const accountConfig: AccountConfig = {
    // // spending key is a byte array which derived from mnemonic
    // sk: deriveSpendingKeyZkBob(mnemonic),
    // // pool alias which should be activated
    // pool: 'WETH-optimism',
    // // the account should have no activity (incoming notes including) before that index
    // // you can use -1 value only for newly created account or undefined (or 0) for full state sync
    // birthindex: 0,
    // // using local prover
    // proverMode: ProverMode.Local,
    // };
    // await client.login(accountConfig);

    // now the client is ready to send transactions, but let's get an account balance first
    // account state will be synced under-the-hood (pass false to getTotalBalance to prevent sync)
    // console.log(`Shielded account balance: ${await client.getTotalBalance()} Gwei`);

    // let's generate our zkAddress to request a few tokens from somebody
    // const zkAddress = await client.generateAddress();
    // console.log(`My zk address: ${zkAddress}`);

    // // and now let's transfer a few tokens inside the pool
    // const tx: TransferRequest = {
    // destination: 'zkbob_sepolia:HGkddpMXSfbXPEa8hUcttUaXpSPJihwA75q2Gue8QGxZtyDieqzb3iSRecdxS7d',  // shielded address
    // amountGwei: BigInt('5000000000'), // 5 BOB
    // }
    // // returns an array of job ID for every transaction
    // // (single transfer may produce several transactions to the pool)
    // const jobIds = await client.transferMulti([tx]);
    // // wait while all transactions will be processed by relayer
    // const result = await client.waitJobsTxHashes(jobIds);
    // console.log(`${result.map((t) => `job #${t.jobId}: ${t.txHash}]`).join(`\n`)}`);

    // // to close all connections to the indexed DBs invoke logout method:
    // await client.logout();
    return client;
}
