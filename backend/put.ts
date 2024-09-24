import { Request, Response } from 'express';
import { Database } from 'sqlite3';

// Update user
function updateUser(database: Database, req: Request, res: Response, id: number) {
	const user = req.body;

	const sql = `
    UPDATE Users SET NAME = ?, LAST_NAME = ?, BIRTH_DATE = ?, DESCRIPTION = ? WHERE ID = ?
  `;

	const values = Object.values(user);

	database.run(sql, [...values, id], (err) => {
		if (err) {
			res.send('Error in updating user');
			return console.error(err.message);
		}

		res.send('User updated');
		console.log('User updated');
	});
}

// Update post
function updatePost(database: Database, req: Request, res: Response, id: number) {
	const post = req.body;

	const sql = `
    UPDATE Posts SET LIKES = ? WHERE ID = ?
  `;

	const values = Object.values(post);

	database.run(sql, [...values, id], (err) => {
		if (err) {
			res.send('Error in updating post');
			return console.error(err.message);
		}

		res.send('Post updated');
		console.log('Post updated');
	});
}

export { updateUser, updatePost };
