<script lang="ts">
	import Cookies from 'js-cookie';
	import type { UserDB } from '../classes/DatabaseClasses';

	let user: UserDB;

	getUser();

	function getUser() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/user');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			user = JSON.parse(hr.response);
		};
	}
	function updateAccount() {
		if (!user.name || !user.lastName) {
			return;
		}

		const obj = {
			NAME: user.name,
			LAST_NAME: user.lastName,
			BIRTH_DATE: user.birthDate,
			DESCRIPTION: user.description
		};

		const objString = JSON.stringify(obj);
		console.log('asd');
		const hr = new XMLHttpRequest();
		hr.open('PUT', `https://localhost:3000/user/${user.id}`);
		hr.setRequestHeader('Content-Type', 'application/json');
		hr.withCredentials = true;
		hr.send(objString);
	}
	function deleteAccount() {
		const hr = new XMLHttpRequest();
		hr.open('DELETE', `https://localhost:3000/user/${user.id}`);
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			const hr2 = new XMLHttpRequest();
			hr2.open('DELETE', 'https://localhost:3000/sessionToken');
			hr2.withCredentials = true;
			hr2.send();
			hr2.onload = () => {
				Cookies.remove('sessionToken');
				window.location.assign('/');
			};
		};
	}
</script>

<div class="acc-container">
	<div class="data-container">
		<h2>Vartotojo nustatymai</h2>
		<p>Asmeninė informacija</p>
		<div class="personal-info-container">
			<div class="pic-first-three">
				<div>
					<label for="name">Vardas</label>
					<input bind:value={user.name} id="name" />
				</div>
				<div>
					<label for="lastname">Pavardė</label>
					<input bind:value={user.lastName} id="lastname" />
				</div>
				<div>
					<label for="birthdate">Gimimo data</label>
					<input bind:value={user.birthDate} id="birthdate" type="date" />
				</div>
			</div>
			<div class="description-container">
				<label for="description">Aprašas</label>
				<textarea bind:value={user.description} id="description"></textarea>
			</div>
		</div>
		<p>Vartotojo informacija</p>
		<div class="user-info-container">
			<div>
				<label for="username">Vartotojo vardas</label>
				<input bind:value={user.username} disabled id="username" />
			</div>
			<div>
				<label for="email">Elektroninis paštas</label>
				<input bind:value={user.email} disabled id="email" />
			</div>
			<div>
				<label for="password">Slaptažodis</label>
				<input bind:value={user.password} disabled id="password" type="password" />
			</div>
			<!-- <div>
          <label for="guild">Gildija</label>
          <input disabled id="guild" />
        </div> -->
		</div>
	</div>
	<div class="buttons">
		<button on:click={deleteAccount} class="delete-btn">Ištrinti paskyrą</button>
		<button on:click={updateAccount} class="update-btn">Atnaujinti paskyrą</button>
	</div>
</div>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	.acc-container {
		width: 1200px;
		height: 100%;

		border-top: 2px solid black;
		border-bottom: 2px solid black;
		border-right: 2px solid black;
	}

	h2 {
		text-align: center;
		margin-top: 10px;
	}

	p {
		font-weight: bold;
		font-size: 21px;
		margin-left: 10px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-size: 18px;
	}

	textarea {
		font-size: 18px;
	}

	input {
		width: 220px;
		height: 30px;
		font-size: 17px;
	}

	.personal-info-container {
		display: flex;
		flex-wrap: wrap;
		gap: 50px;
	}

	.pic-first-three {
		margin-left: 20px;
	}

	.pic-first-three div {
		margin-top: 15px;
	}

	.pic-first-three div:last-child {
		margin-bottom: 20px;
	}

	.description-container {
		margin-top: 15px;
	}

	#description {
		min-width: 500px;
		max-width: 870px;
		height: 130px;
		resize: horizontal;
	}

	.user-info-container {
		margin-left: 20px;
	}

	.user-info-container div {
		margin-top: 15px;
	}

	.user-info-container div:last-child {
		margin-bottom: 20px;
	}

	.acc-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.buttons {
		margin-bottom: 20px;
		margin-right: 20px;
		text-align: end;
	}

	.delete-btn {
		background-color: red;
	}

	.delete-btn:hover {
		background-color: rgb(182, 0, 0);
	}

	.delete-btn:active {
		background-color: rgb(255, 66, 66);
	}

	.update-btn {
		margin-left: 10px;
		background-color: rgb(56, 196, 91);
	}

	.update-btn:hover {
		background-color: rgb(36, 155, 66);
	}

	.update-btn:active {
		background-color: rgb(85, 231, 122);
	}

	button {
		width: 200px;
		height: 50px;
		cursor: pointer;
		color: white;
	}
</style>
