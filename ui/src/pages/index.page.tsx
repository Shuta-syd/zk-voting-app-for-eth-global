/* eslint-disable react-hooks/exhaustive-deps */

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import CreateVote from './createvote.page';
import {
  Mina,
  isReady,
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
import VoteList from "./voteList.page";

declare global {
  interface Window {
    mina: any;
  }
}

export default function Home() {
  let accounts;

  useEffect(() => {
    const init = async () => {
      // data.result is an array that contains approve account's address
      try {
          accounts = await window?.mina?.requestAccounts();
          const network = await window?.mina?.requestNetwork();
          console.log(network); //  'Mainnet' , 'Devnet' , 'Berkeley' or 'Unknown'
          accounts = await window?.mina?.getAccounts();
          console.log(accounts);
        } catch (error: any) {
          // if user reject, requestAccounts will throw an error with code and message filed
          console.log(error.message, error.code)
        }
    }

    init();
  }, [])


  return(
    <>
    <ChakraProvider theme={theme}>
        <Link href="/createvote">
          <Button colorScheme="teal">投票作成</Button>
        </Link>
        <Link href="/voting">
          <Button colorScheme="teal">投票</Button>
        </Link>
      </ChakraProvider>
    </>
  );
};
