import { Mina, isReady, PublicKey, fetchAccount, Field } from 'snarkyjs';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Vote } from '../../..//contracts/src/Vote.js';

const state = {
  Vote: null as null | typeof Vote,
  zkapp: null as null | Vote,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Vote } = await import('../../../contracts/src/Vote.js');
    state.Vote = Vote;
  },
  compileContract: async (args: {}) => {
    await state.Vote!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Vote!(publicKey);
  },
  getNumOfYes: async (args: {}) => {
    const currentNum = await state.zkapp!.number_of_yes.get();
    return JSON.stringify(currentNum.toJSON());
  },
  getNumOfNo: async (args: {}) => {
    const currentNum = await state.zkapp!.number_of_no.get();
    return JSON.stringify(currentNum.toJSON());
  },
  vote: async (args: {num: number}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.vote(Field(args.num));
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};
if (process.browser) {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}
