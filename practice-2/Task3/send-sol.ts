/** @format */

import 'dotenv/config';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, Connection, sendAndConfirmTransaction } from '@solana/web3.js';

let privateKey = process.env['SECRET_KEY'];
if (privateKey === undefined) {
	console.log('Add SECRET_KEY to .env!');
	process.exit(1);
}
const asArray = Uint8Array.from(JSON.parse(privateKey));
const sender = Keypair.fromSecretKey(asArray);

const connection = new Connection(clusterApiUrl('devnet'));

console.log(`🔑 Our public key is: ${sender.publicKey.toBase58()}`);

const recipient = new PublicKey('AnJqC4JBzFFZsDFnT11u528yEZnmKMb75EaP8kwV8b7A');
console.log(`💸 Attempting to send 0.01 SOL to ${recipient.toBase58()}...`);

const transaction = new Transaction();

const sentLamports = 0.01 * LAMPORTS_PER_SOL;
const sendSolInstruction = SystemProgram.transfer({
	fromPubkey: sender.publicKey,
	toPubkey: recipient,
	lamports: sentLamports,
});
transaction.add(sendSolInstruction);

const memoProgram = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

const memoText = 'Hello from Solana!';
/*
const addMemoInstruction = new TransactionInstruction({
	keys: [{ pubkey: sender.publicKey, isSigner: true, isWritable: true }],
	data: Buffer.from(memoText, 'utf-8'),
	programId: memoProgram,
});

transaction.add(addMemoInstruction);

console.log(`📝 memo is: ${memoText}`);
*/
const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);

console.log(`✅ Transaction confirmed, signature: ${signature}!`);
