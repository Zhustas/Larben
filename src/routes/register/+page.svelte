<script>
	let name = '';
	let lastName = '';
	let date;
	let username = '';
	let email = '';
	let password = '',
		passwordRepeat = '';

	const errors = [];

	function register() {
		// Clear errors list
		errors.splice(0, errors.length);

		// Check for errors in fields
		let ret = checkForErrorsAndReturn();
		if (ret !== 0) {
			showErrors(errors);
			return;
		}

		// Send POST /register

		// Convert data into object
		const user = {
			NAME: name,
			LAST_NAME: lastName,
			BIRTH_DATE: date ? date : null,
			USERNAME: username,
			EMAIL: email,
			PASSWORD: password,
			DESCRIPTION: null
		};

		// Convert to json
		const userString = JSON.stringify(user);

		// Send to /register with POST method
		doPOST(userString);
	}

	function doPOST(userString) {
		const hr = new XMLHttpRequest();
		hr.open('POST', 'https://localhost:3000/user');
		hr.setRequestHeader('Content-Type', 'application/json');
		hr.send(userString);
		hr.onload = () => {
			if (hr.response === 'User added') {
				window.location = '/';
			}
		};
	}

	function checkForErrorsAndReturn() {
		if (!name) {
			errors.push({ name: 'Vardas yra tuščias' });
		}
		if (!lastName) {
			errors.push({ lastName: 'Pavardė yra tuščia' });
		}
		if (date && new Date(date) > new Date()) {
			errors.push({ date: 'Gimimo data yra tolimesnė negu dabartinė data' });
		}
		if (!username) {
			errors.push({ username: 'Vartotojo vardas yra tuščias' });
		}
		if (!email) {
			errors.push({ username: 'Elektroninis paštas yra tuščias' });
		}
		if (!password) {
			errors.push({ password: 'Slaptažodis yra tuščias' });
		}
		if (password && password !== passwordRepeat) {
			errors.push({ passwordRepeat: 'Slaptažodžiai nesutampa' });
		}

		if (errors.length !== 0) {
			return 1;
		}

		return 0;
	}

	function showErrors(errors) {
		console.log(errors);
	}
</script>

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Larben Registracija</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
			background-color: #f5f5f5; /* Light gray background */
		}

		h2 {
			font-size: 2rem;
			text-align: center;
			margin-top: 20px;
			color: #4e342e; /* Brown */
		}

		p {
			font-size: 1.2rem;
			text-align: center;
			margin-top: 10px;
			color: #4e342e; /* Brown */
		}

		form {
			max-width: 400px;
			margin: auto;
			background: #fff; /* White background */
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}

		label {
			display: block;
			margin: 7px 0 5px 0;
			color: #4e342e; /* Brown */
		}

		input[type='text'],
		input[type='password'],
		input[type='email'],
		input[type='date'] {
			width: calc(100% - 22px);
			padding: 10px;
			margin-bottom: 10px;
			border: 1px solid #ccc;
			border-radius: 5px;
		}

		button {
			border: none;
			border-radius: 5px;
			padding: 10px 20px;
			font-size: 1rem;
			cursor: pointer;
			background-color: #689f38; /* Light green */
			color: #fff;
			transition: background-color 0.3s ease;
		}

		button:hover {
			background-color: #558b2f; /* Darker shade of green on hover */
		}

		.mandatory::after {
			content: '*';
			color: red;
		}
	</style>
</head>
<body>
	<h2>Larben Registracija</h2>
	<p>Norėdami užsiregistruoti, užpildykite langus</p>

	<form autocomplete="on">
		<label for="name" class="mandatory">Vardas</label>
		<input bind:value={name} type="text" id="name" name="name" required />

		<label for="lastname" class="mandatory">Pavardė</label>
		<input bind:value={lastName} type="text" id="lastname" name="lastname" required />

		<label for="date">Gimimo Data</label>
		<input bind:value={date} type="date" id="date" name="date" />

		<label for="username" class="mandatory">Vartotojo Vardas</label>
		<input bind:value={username} type="text" id="username" name="username" required />

		<label for="email" class="mandatory">El. Paštas</label>
		<input bind:value={email} type="email" id="email" name="email" required />

		<label for="password" class="mandatory">Slaptažodis</label>
		<input bind:value={password} type="password" id="password" name="password" required />

		<label for="passwordrepeat" class="mandatory">Pakartoti Slaptažodį</label>
		<input
			bind:value={passwordRepeat}
			type="password"
			id="passwordrepeat"
			name="passwordrepeat"
			required
		/>

		<button on:click|preventDefault={register}>Registruotis</button>
	</form>
</body>
