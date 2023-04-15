
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import type { Add } from '../../../contracts/src/';
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
} from '@chakra-ui/react'
import Link from 'next/link';

export default function Home() {
  return(
    <>
      <Link href="/createvote">
        <Button colorScheme="teal">投票作成</Button>
      </Link>
    </>
  );
};

