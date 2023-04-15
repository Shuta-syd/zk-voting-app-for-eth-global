import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import  store  from '../redux/store';
import './reactCOIServiceWorker';
import { useState } from 'react';
import ZkappWorkerClient from './zkappWorkerClient';
import { Field, PublicKey } from 'snarkyjs';

export default function App({ Component, pageProps }: AppProps) {
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
