"use client";
import type { Schema } from "../../amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>();

type PostItem = {
	title: string;
	content: string;
	createdAt: string;
	id: string;
};

async function getPosts(): Promise<PostItem[]> {
	const { data, errors } = await amplifyClient.models.Post.list({
		authMode: "identityPool",
	});
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

export default function Home() {
	const [posts, setPosts] = useState<PostItem[]>([]);

	useEffect(() => {
		getPosts().then(setPosts);
	}, []);

	return (
		<div>
			{posts.length === 0 ? (
				<p>No posts found.</p>
			) : (
				<ul>
					{posts.map((post) => (
						<li key={post.id}>
							<h2>{post.title}</h2>
							<p>{post.content}</p>
							<small>{new Date(post.createdAt).toLocaleString()}</small>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
