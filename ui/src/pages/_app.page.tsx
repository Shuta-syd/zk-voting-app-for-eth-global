import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import  store  from '../redux/store';
import './reactCOIServiceWorker';
import { useEffect, useState } from 'react';
import ZkappWorkerClient from './zkappWorkerClient';
import { Field, PublicKey } from 'snarkyjs';

declare global {
  interface Window {
    mina: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
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

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
