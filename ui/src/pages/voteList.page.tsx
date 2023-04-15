import { Box, Button, ChakraProvider, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, addVote, voteContent } from "../redux/store";
import { useState } from "react";
import Link from "next/link";

const VoteList = () => {
  const votes = useSelector((state: RootState) => state.votes);
  const dispatch = useDispatch();
  const [voteDisplayStates, setVoteDisplayStates] = useState(
    Array(votes.length).fill(false)
  );

  const handleDelete = (voteIndex: number) => {
    const newVotes = [...votes];
    newVotes.splice(voteIndex, 1);
    dispatch({ type: 'votes/deleteVote', payload: newVotes });
  }

  const hasExpired = (closedAt: string) => {
    return new Date(closedAt).getTime() < Date.now();
  };

  const handleVote = (voteIndex: number, contentIndex: number) => {
    const vote = votes[voteIndex];
    const now = new Date().toISOString();
    if (vote.closingTime && now > vote.closingTime) {
      // 締切時間を過ぎているため、投票できません
      return;
    }
    dispatch(voteContent({ voteIndex, contentIndex }));
  };

  if (!votes || votes.length === 0) {
    return (
		<ChakraProvider>
			<Text>投票がありません。</Text>
			<Link href="/">ホームに戻る</Link>
		</ChakraProvider>);
  }

  console.log(votes);
  return (
    <ChakraProvider>
      <h1>投票一覧</h1>
      {votes.map((vote, voteIndex) => (
        <Box key={voteIndex} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
          <Box fontWeight="bold" fontSize="xl" mb="2">
            {vote.title}
          </Box>
          <Box>
            {vote.contents &&
              vote.contents.map((content, contentIndex) => {
                const count = vote.count && vote.count[contentIndex];
                const buttonText = voteDisplayStates[voteIndex]
                  ? `${content} (${count || 0})`
                  : content;
                const disabled = vote.closingTime && hasExpired(vote.closingTime);
                return (
                  <Button
                    key={contentIndex}
                    mr="2"
                    mb="2"
                    onClick={() => handleVote(voteIndex, contentIndex)}
                    isDisabled={Boolean(disabled)}
                  >
                    {buttonText}
                    {vote.closingTime && hasExpired(vote.closingTime) ? "（締切）" : ""}
                  </Button>
                );
              })}
          </Box>
          <Button
            onClick={() => {
              const newVoteDisplayStates = [...voteDisplayStates];
              newVoteDisplayStates[voteIndex] = !newVoteDisplayStates[voteIndex];
              setVoteDisplayStates(newVoteDisplayStates);
            }}
          >
            {voteDisplayStates[voteIndex] ? "結果を隠す" : "結果を見る"}
          </Button>
          <Button onClick={() => handleDelete(voteIndex)}>削除する</Button>
        </Box>
      ))}
	  <Link href="/">戻る</Link>
    </ChakraProvider>
  );
};

export default VoteList;
