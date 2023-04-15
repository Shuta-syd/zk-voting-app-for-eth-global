import { isReady, shutdown } from "snarkyjs";

async function main() {
  await isReady;

  console.log('Snarkjs loaded')

  await shutdown();
}

main();
