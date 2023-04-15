import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
} from 'snarkyjs';
import {
  Button,
  ChakraProvider,
} from '@chakra-ui/react'
import Link from 'next/link';
import Web3 from 'web3';

declare global {
  interface Window {
    auro: any;
  }
}

// export default function Home() {
//   const [web3, setWeb3] = useState<Web3>();
// 
//   useEffect(() => {
//     async function connectWallet() {
//       if (typeof window !== 'undefined' && typeof window.auro !== 'undefined') {
//         const provider = await window.auro.enable();
//         const web3Instance = new Web3(provider);
//         setWeb3(web3Instance);
//       } else {
//         console.error('Auro Wallet provider not found');
//       }
//     }
//     connectWallet();
//   }, []);
// 
//   return (
//     <div className={styles.background}>
//       <Head>
//         <h2 className={styles.head}>Mina Protocol Voting App</h2>
//         <meta name="description" content="A decentralized voting app built on the Mina protocol." />
//       </Head>
//       <ChakraProvider>
//         <div className={styles.container}>
//           <Link href="/createvote">
//             <Button colorScheme="teal" className={styles.create}>投票作成</Button>
//           </Link>
//           <Link href="/voting">
//             <Button colorScheme="teal">投票</Button>
//           </Link>
//         </div>
//       </ChakraProvider>
//     </div>
//   );
// };



// Other code remains the same

export default function Home() {
  const [web3, setWeb3] = useState<Web3>();

  useEffect(() => {
    async function connectWallet() {
      if (typeof window !== 'undefined' && typeof window.auro !== 'undefined') {
        const provider = await window.auro.enable();
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
      } else {
        console.error('Auro Wallet provider not found');
      }
    }
    connectWallet();
  }, []);


  return (
    <div className={styles.main}>
      <Head>
        <title>Mina Protocol Voting App</title>
        <meta name="description" content="A decentralized voting app built on the Mina protocol." />
      </Head>
      <ChakraProvider>
        <div className={styles.container}>
          <div className={styles.description}>
            <h2 className={styles.head}>Mina Protocol Voting App</h2>
          </div>
          <div className={styles.create}>
            <Link href="/createvote">
              <Button colorScheme="teal">投票作成</Button>
            </Link>
            <Link href="/voting">
              <Button colorScheme="teal">投票</Button>
            </Link>
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
};








// const [web3, setWeb3] = useState<Web3 | null>(null);

// useEffect(() => {
//   const initWeb3 = async () => {
//     if (typeof window.ethereum !== 'undefined') {
//       // auroWalletがインストールされているか確認する
//       const provider = window.ethereum;
//       // Web3オブジェクトを作成し、Ethereumブロックチェーンに接続する
//       const web3 = new Web3(provider);
//       // auroWalletに接続する
//       await provider.request({ method: 'eth_requestAccounts' });
//       setWeb3(web3);
//     } else {
//       console.log('auroWalletがインストールされていません');
//     }
//   };
//   initWeb3();
// }, []);
