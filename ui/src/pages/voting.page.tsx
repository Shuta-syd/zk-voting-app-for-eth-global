import { Card } from "@chakra-ui/react";
import React from "react";
import VoteList from "./voteList.page";

const Voting = () => {
	return (
		<div>
			<h1>投票ページ</h1>
			<Card>
      <VoteList />
			</Card>
		</div>
	);
};

export default Voting;
