<script lang="ts">
	import type { PostDB, UserDB } from '../classes/DatabaseClasses';

	// The town crier (šauklys) used to make public announcements in the streets.
	let posts: PostDB[] = [];

	let text = '';
	let author = 'Justas';
	let likes = 124515;

	let user: UserDB;
	let users: UserDB[] = [];

	getUser();
	getAllUsers();
	getPosts();

	function getUser() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/user');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			user = JSON.parse(hr.response);
		};
	}

	function getAllUsers() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/users');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			users = JSON.parse(hr.response);
		};
	}

	// *************************************** GETTING POSTS ************************************
	function addToPosts(response: string) {
		const res = JSON.parse(response);

		let datetime = new Date().toLocaleString('lt-LT', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});

		// for (let post of res) {
		// 	const postDB: PostDB = post;
		// 	if (post.id) {
		// 		for (let usr of users) {
		// 			if (usr.id == postDB.userId) {
		// 				postDB.userId = usr.id;
		// 			}
		// 		}
		// 		post['POST_DATETIME'] = new Date(post['POST_DATETIME']).toLocaleString('lt-LT', {
		// 			year: 'numeric',
		// 			month: 'numeric',
		// 			day: 'numeric',
		// 			hour: 'numeric',
		// 			minute: 'numeric'
		// 		});
		// 		posts = [post, ...posts];
		// 	}
		// }
	}

	function getPosts() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/posts');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			addToPosts(hr.response);
		};
	}

	// // *************************************** POSTING POST ************************************
	function post() {
		if (!text) {
			return;
		}

		// Convert information into object
		const post = {
			USER_ID: user.id,
			TEXT: text,
			POST_DATETIME: new Date().getTime(),
			LIKES: 0
		};

		// Convert to json
		const postString = JSON.stringify(post);

		// Send to /insertPost with POST method
		postPost(postString);
	}

	function postPost(postString: string) {
		const hr = new XMLHttpRequest();
		hr.open('POST', 'https://localhost:3000/post');
		hr.setRequestHeader('Content-Type', 'application/json');
		hr.withCredentials = true;
		hr.send(postString);
		hr.onload = () => {
			console.log(hr.response);
		};

		text = '';
	}
</script>

<div class="main-container">
	<div class="top">
		<h2>Naujienos</h2>
	</div>
	<div class="area">
		<div class="left-side"></div>
		<div class="posts">
			{#each posts as { userId, postDateTime, text, likes }, index}
				<div class="post">
					<div class="post-main-container">
						<p class="author">{userId}</p>
						<!-- {#if USER_ID === 1}
              <button class="delete-post-btn">x</button>
            {/if} -->
						<p class="datetime">{postDateTime}</p>
						<p class="text">{text}</p>
					</div>
					<!-- <button on:click={() => handleClick(index)} class="likes"
            >{LIKES}</button
          > -->
				</div>
			{/each}
		</div>
		<div class="right-side">
			<p>Tavo naujas pranešimas</p>
			<textarea bind:value={text}></textarea>
			<button on:click={post} class="add-post-btn">Pridėti pranešimą</button>
			<!-- <button on:click={getPosts}>Click me to get posts</button> -->
			<!-- <button on:click={post}>Click me to add a post</button> -->
		</div>
	</div>
</div>

<style>
	.main-container {
		width: 1200px;
		height: 100%;

		border-top: 2px solid black;
		border-bottom: 2px solid black;
		border-right: 2px solid black;

		display: flex;
		flex-direction: column;
	}

	.top {
		width: 100%;
		height: 10%;

		/* text-align: center; */

		display: flex;
		justify-content: center;
		/* align-items: center; */
	}

	h2 {
		margin-top: 10px;
	}

	.area {
		height: 90%;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.left-side {
		width: 10%;
		height: 100%;
	}

	.posts {
		width: 50%;
		height: 100%;
		overflow: scroll;
		overflow-x: hidden;
	}

	.post {
		border-bottom: 1px solid rgb(197, 197, 197);
	}

	.right-side {
		width: 40%;
		height: 100%;
	}

	.post {
		position: relative;
		padding: 0;
		margin: 0;
		width: 500px;
		background-color: blue;
		margin: 40px 30px; /* Jei pakeisti "post" dydį */
		border: 1px solid black;
	}

	.post p {
		margin: inherit;
		font-size: 18px;
	}

	.post-main-container {
		width: 500px;
		background-color: rgb(224, 224, 224);
		word-wrap: break-word;
	}

	.post-main-container:hover {
		background-color: rgb(241, 241, 241);
	}

	.author,
	.datetime {
		display: inline-block;
	}

	.author {
		padding: 5px 0 0 5px;
	}

	.datetime {
		float: right;
		padding: 5px 10px 0 0;
	}

	/* .delete-post-btn {
    float: right;
    margin: 5px 5px 0 0;
  } */

	.text {
		padding: 10px 15px 30px 15px;
	}

	/* .likes {
    text-wrap: wrap;
    border: 2px solid black;
    position: absolute;
    cursor: pointer;
    min-width: 40px;
    max-width: 100px;
    height: 40px;
    bottom: -20px;
    right: -20px;
    color: white;
    background-color: rgb(255, 80, 80);
    font-size: 15px;
  } */

	/* .likes:hover {
    background-color: rgb(255, 19, 19);
  } */

	/* .likes:active {
    background-color: rgb(255, 109, 109);
  } */

	.right-side p {
		font-size: 18px;
		margin-left: 10px;
		margin-bottom: 5px;
	}

	textarea {
		margin-left: 10px;
		width: 90%;
		min-height: 20%;
		max-height: 50%;
		resize: vertical;
		display: block;
		font-size: 18px;
	}

	.add-post-btn {
		margin-top: 10px;
		margin-right: 40px;
		float: right;
		background-color: rgb(56, 196, 91);
		height: 40px;
		width: 150px;
		color: white;

		cursor: pointer;
	}

	.add-post-btn:hover {
		background-color: rgb(36, 155, 66);
	}

	.add-post-btn:active {
		background-color: rgb(85, 231, 122);
	}
</style>
