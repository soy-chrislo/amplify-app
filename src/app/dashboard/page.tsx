"use client";
import { useState, useEffect, type FormEvent } from "react";
import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const amplifyClient = generateClient<Schema>();

type PostItem = {
	title: string;
	content: string;
	createdAt: string;
	id: string;
};

async function createPost({
	title,
	content,
}: { title: string; content: string }) {
	const { data, errors } = await amplifyClient.models.Post.create({
		title,
		content,
		createdAt: new Date().toISOString(),
	});

	if (errors) {
		console.error(errors);
		return;
	}

	return data;
}

async function getPosts(): Promise<PostItem[]> {
	const { data, errors } = await amplifyClient.models.Post.list();
	if (errors) {
		console.error(errors);
		return [];
	}
	return data.map((post) => ({
		title: post.title || "",
		content: post.content || "",
		createdAt: post.createdAt || "",
		id: post.id || "",
	}));
}

export default function page() {
	const [posts, setPosts] = useState<PostItem[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		getPosts().then(setPosts);
	}, []);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await createPost({ title, content });
		setTitle("");
		setContent("");
		const fresh = await getPosts();
		setPosts(fresh);
	};

	return (
		<div>
			<h1>Protegido</h1>

			<form onSubmit={handleSubmit}>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					required
				/>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Content"
					required
				/>
				<button type="submit">Create Post</button>
			</form>

			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<h2>{post.title}</h2>
						<p>{post.content}</p>
						<small>{new Date(post.createdAt).toLocaleString()}</small>
					</li>
				))}
			</ul>
		</div>
	);
}
