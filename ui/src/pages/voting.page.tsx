import { Card } from "@chakra-ui/react";
import React from "react";
import VoteList from "./voteList.page";
import styles from '../styles/Home.module.css';

const Voting = () => {
	return (
      <div className={styles.multi}>
			<h1></h1>
			<Card>
      <VoteList />
			</Card>
		</div>
	);
};

export default Voting;
