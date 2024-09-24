// Insert user
function insertUser(database, req, res) {
	// Get user object from json
	const user = req.body;

	// Create SQL text
	const sql = `
      INSERT INTO Users (NAME, LAST_NAME, BIRTH_DATE, USERNAME, EMAIL, PASSWORD, DESCRIPTION, GUILD_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

	// Get only values from user object
	const values = Object.values(user).map((value) => value);

	// Insert user
	database.run(sql, values, (err) => {
		if (err) {
			res.send('Error in inserting user');
			return console.error(err.message);
		}

		res.send('User added');
		console.log('User added');
	});
}

// Check credentials
function checkCredentials(database, req, res, expirationTime) {
	// Get username and password
	const { USERNAME: username, PASSWORD: password } = req.body;

	// SQL for finding user
	const sql = `SELECT * FROM Users WHERE USERNAME = ? AND PASSWORD = ?`;

	// Find first row where username and password matches
	database.get(sql, [username, password], (err, row) => {
		if (err) {
			res.send('Error in checking credentials');
			return console.error(err.message);
		}

		// If row is found
		if (row) {
			const token = insertSessionToken(database, row['ID']);

			const plus3Hours = 3 * 60 * 60 * 1000;
			res
				.cookie('sessionToken', token, {
					maxAge: plus3Hours + expirationTime,
					path: '/',
					secure: false,
					domain: 'localhost'
				})
				.send('User authorized');
			return;
		}
		res.send('No user found');
	});
}

// Insert session token (not POST method)
function insertSessionToken(database, USER_ID) {
	// SQL for inserting Session Token
	const sql = `
      INSERT INTO SessionTokens(USER_ID, TOKEN, TOKEN_CREATED)
      VALUES (?, ?, ?);
    `;

	// Session Token values
	const plus3Hours = 3 * 60 * 60 * 1000;
	const crypto = require('crypto-js');

	const values = [
		USER_ID,
		crypto.lib.WordArray.random(32).toString(),
		new Date().getTime() + plus3Hours
	];

	// Insert Session Token
	database.run(sql, values, (err) => {
		if (err) {
			return console.error(err);
		}

		console.log('Session token added');
	});

	return values[1];
}

// Insert post
function insertPost(database, req, res) {
	// Get post object from json
	const post = req.body;

	// Create SQL text
	const sql = `
      INSERT INTO Posts (USER_ID, TEXT, POST_DATETIME, LIKES)
      VALUES (?, ?, ?, ?);
    `;

	// Get only values from post object
	const values = Object.values(post).map((value) => value);

	// Insert post
	database.run(sql, values, (err) => {
		if (err) {
			res.send('Error in inserting post');
			return console.error(err.message);
		}

		res.send('Post added');
		console.log('Post added');
	});
}

// Insert marker
function insertMarker(database, req, res) {
	// Get marker object from json
	const marker = req.body;

	// Create SQL text
	const sql = `
      INSERT INTO Markers (USER_ID, DESCRIPTION, LATITUDE, LONGITUDE)
      VALUES (?, ?, ?, ?);
    `;

	// Get values from marker object
	const values = Object.values(marker);

	// Insert marker
	database.run(sql, values, (err) => {
		if (err) {
			res.send('Error in inserting marker');
			return console.error(err.message);
		}

		res.send('Marker added');
		console.log('Marker added');
	});
}

module.exports = { insertUser, checkCredentials, insertPost, insertMarker };
