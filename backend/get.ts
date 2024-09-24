import { Response } from 'express';
import { Database } from 'sqlite3';

// Get user by id
function getUserBySessionToken(database: Database, res: Response, sessionToken: string) {
	const sql = 'SELECT USER_ID FROM SessionTokens WHERE token = ?';

	database.get(sql, sessionToken, (err, row) => {
		if (err) {
			res.send('Error in getting user by id');
			return console.error(err.message);
		}

		if (row) {
			database.get('SELECT * FROM Users WHERE ID = ?', row['USER_ID'], (err, row) => {
				if (err) {
					res.send('Error in getting user by id');
					return console.error(err.message);
				}

				res.json(row);
			});
		}
	});
}

// Get users
function getUsers(database: Database, res: Response) {
	database.all('SELECT * FROM Users', (err, rows) => {
		if (err) {
			res.send('Error in getting users');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Get posts
function getPosts(database: Database, res: Response) {
	database.all('SELECT * FROM Posts', (err, rows) => {
		if (err) {
			res.send('Error in getting posts');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Get markers
function getMarkers(database: Database, res: Response) {
	database.all('SELECT * FROM Markers', (err, rows) => {
		if (err) {
			res.send('Error in getting markers');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Check session token for expiration
function checkSessionTokenForExpiration(database: Database, res: Response, sessionToken: string) {
	// SQL for checking Session Token expiration
	const sql = `
      SELECT * FROM SessionTokens WHERE TOKEN = ?;
    `;

	// Get row
	database.get(sql, sessionToken, (err, row) => {
		if (err) {
			res.send('Error in getting session token');
			return console.error(err.message);
		}

		if (row) {
			const TOKEN_CREATED: Date = row['TOKEN_CREATED'];

			const plus3Hours = 3 * 60 * 60 * 1000;
			if (TOKEN_CREATED.getTime() + 1 * 60 * 1000 < new Date().getTime() + plus3Hours) {
				res.send('Session token expired');
			} else {
				res.send('Session token valid');
			}
		} else {
			res.send("Session token doesn't exist");
		}
	});
}

export { getUserBySessionToken, getUsers, getPosts, getMarkers, checkSessionTokenForExpiration };
