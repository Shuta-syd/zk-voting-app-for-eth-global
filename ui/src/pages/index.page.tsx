/* eslint-disable react-hooks/exhaustive-deps */

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { createContext, useEffect, useState } from 'react';
import CreateVote from './createvote.page';
import {
  Mina,
  isReady,
  Field,
  PublicKey,
  fetchAccount,
} from 'snarkyjs';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  ChakraProvider,
} from '@chakra-ui/react'
import { theme } from '@chakra-ui/react';
import Link from 'next/link';
import ZkappWorkerClient from './zkappWorkerClient';

export const OnSendTransactionContext = createContext(async (num: number) => {});

let transactionFee = 0.1;

declare global {
  interface Window {
    mina: any;
  }
}

export default function Home() {
  let accounts;
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });


  useEffect(() => {
    const init = async () => {
      // data.result is an array that contains approve account's address
      try {
        if (!state.hasBeenSetup) {
          const zkappWorkerClient = new ZkappWorkerClient();

          console.log('Loading SnarkyJS...');
          await zkappWorkerClient.loadSnarkyJS();
          console.log('done');

          await zkappWorkerClient.setActiveInstanceToBerkeley();

          const mina = (window as any).mina;

          console.log(mina);

          if (mina == null) {
            setState({ ...state, hasWallet: false });
            return;
          }

          accounts = await window.mina.requestAccounts();
          accounts = await window?.mina?.getAccounts();
          console.log(accounts);
          const publicKeyBase58: string = accounts[0];
          const publicKey = PublicKey.fromBase58(publicKeyBase58);
          console.log('using key', publicKey.toBase58());
          const network = await window.mina.requestNetwork();
          console.log(network); //  'Mainnet' , 'Devnet' , 'Berkeley' or 'Unknown'

          console.log('checking if account exists...');
          const res = await zkappWorkerClient.fetchAccount({
            publicKey: publicKey!,
          });
          const accountExists = res.error == null;
          await zkappWorkerClient.loadContract();

          console.log('compiling zkApp');
          await zkappWorkerClient.compileContract();
          console.log('zkApp compiled');

          const zkappPublicKey = PublicKey.fromBase58(
            'B62qiqD8k9fAq94ejkvzaGEV44P1uij6vd6etGLxcR4dA8ZRZsxkwvR'
          );

          await zkappWorkerClient.initZkappInstance(zkappPublicKey);

          console.log('getting zkApp state...');
          await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });

          setState({
            ...state,
            zkappWorkerClient,
            hasWallet: true,
            hasBeenSetup: true,
            publicKey,
            zkappPublicKey,
            accountExists,
          });
          await zkappWorkerClient.loadContract();
        }
        } catch (error: any) {
          // if user reject, requestAccounts will throw an error with code and message filed
          console.log(error.message, error.code)
        }
    }

    init();
  }, [])


  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log('checking if account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  const onSendTransaction = async (num: number) => {
    console.log(true);
    setState({ ...state, creatingTransaction: true });
    console.log('sending a transaction...');

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    await state.zkappWorkerClient!.Vote(num);

    console.log('creating proof...');
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log('getting Transaction JSON...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    console.log('requesting send transaction...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log(
      'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );

    setState({ ...state, creatingTransaction: false });
  };

  return(
    <>
      <OnSendTransactionContext.Provider value={onSendTransaction}>
      <ChakraProvider theme={theme}>
          <Link href="/createvote">
            <Button colorScheme="teal">投票作成</Button>
          </Link>
          <Link href="/voting">
            <Button colorScheme="teal">投票</Button>
          </Link>
        </ChakraProvider>
      </OnSendTransactionContext.Provider>
    </>
  );
};
