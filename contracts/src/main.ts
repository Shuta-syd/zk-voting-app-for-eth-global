import { AccountUpdate, Field, Mina, PrivateKey, isReady, shutdown } from "snarkyjs";
import { Vote } from "./Vote.js";

async function main() {
  await isReady;

  console.log('Snarkjs loaded')

  const useProof = false;
  const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
  Mina.setActiveInstance(Local);
  const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
  const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];

  // Create a public/private key pair. The public key is our address and where we will deploy to
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  // create an instance of Square - and deploy it to zkAppAddress
  const zkAppInstance = new Vote(zkAppAddress);
  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy();
  });
  await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

  // get the initial state of Square after deployment
  const num_yes_0 = zkAppInstance.number_of_yes.get();
  const num_no_0 = zkAppInstance.number_of_no.get();
  console.log('[0] state after init Yes:', num_yes_0.toString());
  console.log('[0] state after init No:', num_no_0.toString());

  const txn1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.vote(Field(1), zkAppInstance.number_of_yes.get(), zkAppInstance.number_of_no.get());
  });
  await txn1.prove();
  await txn1.sign([senderKey]).send();

  const num_yes_1 = zkAppInstance.number_of_yes.get();
  const num_no_1 = zkAppInstance.number_of_no.get();
  console.log('[1] state after init Yes:', num_yes_1.toString());
  console.log('[1] state after init No:', num_no_1.toString());

  const txn2 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.vote(Field(0), zkAppInstance.number_of_yes.get(), zkAppInstance.number_of_no.get());
  });
  await txn1.prove();
  await txn1.sign([senderKey]).send();

  const num_yes_2 = zkAppInstance.number_of_yes.get();
  const num_no_2 = zkAppInstance.number_of_no.get();
  console.log('[2] state after init Yes:', num_yes_2.toString());
  console.log('[2] state after init No:', num_no_2.toString());

  await shutdown();
}

main();
