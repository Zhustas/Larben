<script lang="ts">
	import Cookies from 'js-cookie';

	if (Cookies.get('sessionToken')) {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/checkSessionToken');
		hr.withCredentials = true;
		hr.send();

		hr.onload = () => {
			const response = hr.response;

			console.log(response);

			if (response !== 'Session token valid') {
				const hr2 = new XMLHttpRequest();
				hr2.open('DELETE', 'https://localhost:3000/sessionToken');
				hr2.withCredentials = true;
				hr2.send();
				hr2.onload = () => {
					Cookies.remove('sessionToken');
				};
			} else {
				window.location.assign('/main');
			}
		};
	}

	let username = '';
	let password = '';

	function login() {
		// Convert username and password into object
		const user = {
			USERNAME: username,
			PASSWORD: password
		};

		// Convert to json
		const userString = JSON.stringify(user);

		// Send to /getUserByCredentials with POST method
		doPOST(userString);
	}

	function doPOST(userString: string) {
		const hr = new XMLHttpRequest();
		hr.open('POST', 'https://localhost:3000/checkCredentials');
		hr.setRequestHeader('Content-Type', 'application/json');
		hr.withCredentials = true;
		hr.send(userString);
		hr.onload = () => {
			if (hr.response === 'User authorized') {
				window.location.assign('/main');
			}
		};
	}

	function register() {
		window.location.assign('/register');
	}

	// *********************************** Cookies ***************************************
	function setCookie(cName: string, cValue: any, expDays: number) {
		let date = new Date();
		date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);

		const expires = 'expires=' + date.toUTCString();

		// Creating cookie
		document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'; // path=/main
	}

	function getCookie(cName: string) {
		const name = cName + '=';
		const cDecoded = decodeURIComponent(document.cookie);
		const cArray = cDecoded.split('; ');

		let value;
		cArray.forEach((val) => {
			if (val.indexOf(name) === 0) {
				value = val.substring(name.length);
			}
		});

		return value;
	}

	function cookieMessage() {
		if (!getCookie('cookie')) {
			document.querySelector<HTMLElement>('#cookies')!.style.display = 'block';
		}
	}

	function cookiesOnClick() {
		document.querySelector<HTMLElement>('#cookies')!.style.display = 'none';

		// Creating cookie (expire in 30 days)
		setCookie('cookie', true, 30);
	}
</script>

<svelte:window on:load={cookieMessage} />

<h1 class="title">Larben</h1>
<p class="welcome">Sveiki atvykę į Lietuvos Archeologijos Bendruomenę!</p>

<form autocomplete="on">
	<label for="username">Vartotojo vardas</label>
	<input bind:value={username} type="text" id="username" name="username" />

	<label for="password" id="password-lbl">Slaptažodis</label>
	<input bind:value={password} type="password" id="password" name="password" />

	<button on:click|preventDefault={login} id="login-btn">Prisijungti</button>
</form>

<!-- <hr /> -->
<!-- <hr /> -->
<div class="bot-region">
	<p>Neturi paskyros? Spausk registracijos mygtuką.</p>
	<button on:click={register} id="reg-btn">Registruotis</button>
</div>

<div id="cookies">
	<div class="container">
		<div class="subcontainer">
			<div class="cookies">
				<p>
					Ši svetainė naudoja slapukus (angl. <em>Cookies</em>), kad gautumėte geriausią patirtį
					naudojant mūsų svetainę.
					<a href="https://lad.lt/">Daugiau informacijos.</a>
					<button id="cookies-btn" on:click={cookiesOnClick}>Sutinku</button>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* General Styling */
	/* General Styling */
	label {
		font-family: Arial, sans-serif;
		margin: 5px;
		padding: 0;
		/*background-color: #f5f5f5; /* Light gray background */
	}

	.container {
		max-width: 1200px;
		margin: auto;
		padding: 0 20px;
	}

	.subcontainer {
		width: 100%;
		margin: auto;
	}

	/* Header Styling */
	.title {
		font-size: 2rem;
		text-align: center;
		margin-top: 150px;
		color: #4e342e; /* Brown */
	}

	.welcome {
		font-size: 1.2rem;
		text-align: center;
		margin-top: 10px;
		color: #4e342e; /* Brown */
	}

	.bot-region {
		margin-left: 20px;
		text-align: center;
	}

	/* Form Styling */
	form {
		max-width: 400px;
		margin: auto;
		background: #fff; /* White background */
		padding: 50px 50px 50px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	label {
		display: block;
		margin-bottom: 8px;
		color: #4e342e; /* Brown */
	}

	input[type='text'],
	input[type='password'] {
		width: calc(100% - 22px);
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	#login-btn,
	#reg-btn,
	#cookies-btn {
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 1rem;
		cursor: pointer;
		background-color: #689f38; /* Light green */
		color: #fff;
		transition: background-color 0.3s ease;
	}

	#login-btn:hover,
	#reg-btn:hover,
	#cookies-btn:hover {
		background-color: #558b2f; /* Darker shade of green on hover */
	}

	/* Cookies Styling */
	#cookies {
		width: 100%;
		position: fixed;
		bottom: 0;
		color: white;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 1;
		display: none;
	}

	.cookies {
		min-height: 70px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		padding: 10px;
	}

	.cookies a {
		color: #ff0;
		font-weight: bold;
		text-decoration: none;
	}
</style>
