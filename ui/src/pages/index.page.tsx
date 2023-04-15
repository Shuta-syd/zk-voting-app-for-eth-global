
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import type { Add } from '../../../contracts/src/';
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



export default function Home() {
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

