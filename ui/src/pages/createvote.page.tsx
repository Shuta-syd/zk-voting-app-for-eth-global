// pages/createvote.js

import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import {  useState } from "react";
import Link from "next/link";

const CreateVote = () => {
const [inputValue, setInputValue] = useState<string[]>([]);

const handleInputChange = (event: any, index : number) => {
	const values = [...inputValue];
	values[index] = event.target.value;
    setInputValue(values);
};

const addInput = () => {
	setInputValue([...inputValue, ""]);
};

const handleSubmit = (event : any) => {
    event.preventDefault();
    // 投票作成のロジックをここに実装
    console.log("投票作成ボタンがクリックされました！");
	setInputValue([""]);
	window.location.href = "/";
};

	return (
		<>
		<FormControl id="voteTitle" isRequired>
        <FormLabel>投票タイトル</FormLabel>
        <Input type="text" />
        <FormErrorMessage>投票タイトルを入力してください。</FormErrorMessage>
		</FormControl>
		{inputValue.map((value, index) => (
			<FormControl key={index}>
			<FormLabel>投票内容</FormLabel>
			<Input type="text" value={value} onChange={(event) => handleInputChange(event, index)} />
			<FormErrorMessage>投票内容を入力してください。</FormErrorMessage>
			</FormControl>
		))}
		<Button mt={4} colorScheme="teal" onClick={addInput}>
        追加
		</Button>
        <Button mt={4} ml={4} colorScheme="teal" onClick={handleSubmit}>
			投票作成
        </Button>
		<Link href="/">
			<Button mt={4} ml={4} colorScheme="teal">
				戻る
			</Button>
		</Link>
		</>
	);
};

export default CreateVote;



// const [title, setTitle] = useState('');
				{/* <FormControl id="title" isRequired>
					<FormLabel>タイトル</FormLabel>
					<Input
						type="text"
						// value={title}
						// onChange={(e) => setTitle(e.target.value)}
					/>
					<FormErrorMessage>タイトルを入力してください</FormErrorMessage>
				</FormControl> */}