import { Button, ChakraProvider, Input, Link } from "@chakra-ui/react";
import { statSync } from "fs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addVote } from "../redux/store";
import styles from '../styles/Home.module.css';

const CreateVote = () => {
	const [title, setTitle] = useState("");
	const [contents, setContents] = useState<string[]>([]);
	const [closingTime, setClosingTime] = useState("");
	const dispatch = useDispatch();

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	const handleContentChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newContents = [...contents];
		newContents[index] = event.target.value;
		setContents(newContents);
	};

	const addContent = () => {
		setContents([...contents, ""]);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const vote = { title, contents, closingTime};
		dispatch(addVote(vote));
		setTitle("");
		setContents([]);
		setClosingTime("");
		window.location.href = "/";
	};

	const handleContentDelete = (index: number) => {
		const newContents = [...contents];
		newContents.splice(index, 1);
		setContents(newContents);
	};

	const handleClosingTimeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setClosingTime(event.target.value);
	};

	return (
		<ChakraProvider>
			<div>
				<h1>投票作成</h1>
				<form onSubmit={handleSubmit}>
					<div className={styles.voteTitle}>
						<label className={styles.voteTitleLabel}>投票タイトル</label>
						<Input
							type="text"
							id="voteTitle"
							value={title}
							onChange={handleTitleChange}
							required
							width={200}
						/>
					</div>
					{contents.map((content, index) => (
						<div key={index} className={styles.voteContent}>
							<label htmlFor={`voteContent${index}`} className={styles.voteContentLabel}>投票内容</label>
							<Input
								type="text"
								id={`voteContent${index}`}
								value={content}
								onChange={(event) => handleContentChange(event, index)}
								required
								width={200}
							/>
							<Button onClick={() => handleContentDelete(index)}>削除</Button>
						</div>
					))}
					<Button type="button" onClick={addContent}>
						追加
					</Button>
					<div className={styles.closingTime}>
						<label htmlFor="closingTime">締め切り時間</label>
						<Input
							type="datetime-local"
							id="closingTime"
							value={closingTime}
							onChange={handleClosingTimeChange}
							required
							width={200}
						/>
					</div>
					<Button className={styles.Submit}>投票作成</Button>
					<Link href="/">
						<Button>戻る</Button>
					</Link>
				</form>
			</div>
		</ChakraProvider>
	);
};

export default CreateVote;



