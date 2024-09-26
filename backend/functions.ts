import type { Request } from 'express';
import { Database } from 'sqlite3';

// Check if given sessionToken exists in database
function checkSessionTokenExists(database: Database, sessionToken: string, callback: Function) {
	const sql = 'SELECT * FROM SessionTokens WHERE TOKEN = ?';

	database.get(sql, sessionToken, (err, row) => {
		if (err) {
			callback(false);
			return console.error(err.message);
		}

		if (row) {
			callback(true);
			return;
		}
		callback(false);
	});
}

// Validates request body
function validRequestBody(req: Request, expectations: object): boolean {
	const body = req.body;
	const bodyKeys = Object.keys(body);
	let expKeys = Object.keys(expectations);

	// Information is not equal
	if (bodyKeys.length !== expKeys.length) {
		return false;
	}

	for (const key of bodyKeys) {
		// Delete from expKeys if key exists
		if (expKeys.includes(key)) {
			const index = expKeys.indexOf(key);
			expKeys.splice(index, 1);
		}
	}

	// Bad information
	if (expKeys.length > 0) {
		return false;
	}

	const keys: string[] = Object.keys(expectations);
	const values: string[] = Object.values(expectations);

	// Bad data types
	for (const key of bodyKeys) {
		const index: number = keys.indexOf(key);
		const expectedType: string = values[index];

		if (expectedType === 'int' || expectedType === 'double') {
			// Expected number
			if (typeof body[key] !== 'number') {
				return false;
			}
		} else if (expectedType === 'date' || expectedType === 'datetime') {
			// Expected date
			let date = new Date(body[key]);
			if (isNaN(date.getTime()) && body[key] !== null) {
				return false;
			}
		}
	}

	return true;
}

// Insert session token (not POST method)
function insertSessionToken(database: Database, USER_ID: number) {
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

export { checkSessionTokenExists, validRequestBody, insertSessionToken };
