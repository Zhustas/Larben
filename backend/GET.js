// Get user by id
function getUserBySessionToken(database, res, sessionToken) {
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
function getUsers(database, res) {
	database.all('SELECT * FROM Users', (err, rows) => {
		if (err) {
			res.send('Error in getting users');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Get posts
function getPosts(database, res) {
	database.all('SELECT * FROM Posts', (err, rows) => {
		if (err) {
			res.send('Error in getting posts');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Get markers
function getMarkers(database, res) {
	database.all('SELECT * FROM Markers', (err, rows) => {
		if (err) {
			res.send('Error in getting markers');
			return console.error(err.message);
		}

		res.json(rows);
	});
}

// Check session token for expiration
function checkSessionTokenForExpiration(database, req, res, sessionToken) {
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
			const { TOKEN_CREATED } = row;

			const plus3Hours = 3 * 60 * 60 * 1000;

			console.log(sessionToken);
			console.log(new Date(TOKEN_CREATED + 1 * 60 * 1000));
			console.log(new Date());
			if (TOKEN_CREATED + 1 * 60 * 1000 < new Date().getTime() + plus3Hours) {
				res.send('Session token expired');
			} else {
				res.send('Session token valid');
			}
		} else {
			res.send("Session token doesn't exist");
		}
	});
}

module.exports = {
	getUserBySessionToken,
	getUsers,
	getPosts,
	getMarkers,
	checkSessionTokenForExpiration
};

// Old function
// function getUsers(res) {
//   this.#database?.all("SELECT * FROM Users", (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: "Internal server error" });
//     }

//     rows = [
//       {
//         identification: crypto.lib.WordArray.random(32).toString(),
//       },
//       ...rows,
//     ];
//     res.json(rows);
//   });
// }

// app.get("/users", jsonParser, (req, res) => {
//   database.getUsers(res);
// });
