import { Button, ChakraProvider, Input, Link } from "@chakra-ui/react";
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
		const vote = { title, contents, closingTime };
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
      <div className={styles.multi}>
				<h1>make</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="voteTitle">title</label>
						<Input
							type="text"
							id="voteTitle"
							value={title}
							onChange={handleTitleChange}
							required
						/>
					</div>
					{contents.map((content, index) => (
						<div key={index}>
							<label htmlFor={`voteContent${index}`}>content</label>
							<Input
								type="text"
								id={`voteContent${index}`}
								value={content}
								onChange={(event) => handleContentChange(event, index)}
								required
							/>
							<Button onClick={() => handleContentDelete(index)}>delete</Button>
						</div>
					))}
					<Button type="button" onClick={addContent}>
						add
					</Button>
					<div>
						<label htmlFor="closingTime">deadline</label>
						<Input
							type="datetime-local"
							id="closingTime"
							value={closingTime}
							onChange={handleClosingTimeChange}
							required
						/>
					</div>
					<Button type="submit">make</Button>
					<Link href="/">
						<Button>back</Button>
					</Link>
				</form>
			</div>
		</ChakraProvider>
	);
};

export default CreateVote;
