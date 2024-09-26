import type { Request, Response } from 'express';
import { Database } from 'sqlite3';
import { insertSessionToken } from './functions';
import type { UserDB } from './classes';

// Insert user
function insertUser(database: Database, req: Request, res: Response) {
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
function checkCredentials(database: Database, req: Request, res: Response, expirationTime: number) {
	// Get username and password
	const { USERNAME: username, PASSWORD: password } = req.body;

	// SQL for finding user
	const sql = `SELECT * FROM Users WHERE USERNAME = ? AND PASSWORD = ?`;

	// Find first row where username and password matches
	database.get(sql, [username, password], (err, row: UserDB) => {
		if (err) {
			res.send('Error in checking credentials');
			return console.error(err.message);
		}

		// If row is found
		if (row) {
			const user: UserDB = row;
			const token = insertSessionToken(database, user.id);

			const plus3Hours: number = 3 * 60 * 60 * 1000;
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

// Insert post
function insertPost(database: Database, req: Request, res: Response) {
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
function insertMarker(database: Database, req: Request, res: Response) {
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

export { insertUser, checkCredentials, insertPost, insertMarker };
