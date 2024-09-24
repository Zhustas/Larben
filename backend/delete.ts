import { Response } from 'express';
import { Database } from 'sqlite3';

// Delete user
function deleteUser(database: Database, res: Response, id: number) {
	database.run('DELETE FROM Users WHERE ID = ?', id, (err) => {
		if (err) {
			res.send('Error in deleting user');
			return console.error(err.message);
		}

		res.send('User deleted');
		console.log('User deleted');
	});
}

// Delete session token
function deleteSessionToken(database: Database, res: Response, sessionToken: string) {
	const sql = 'DELETE FROM SessionTokens WHERE TOKEN = ?';
	database.run(sql, sessionToken, (err) => {
		if (err) {
			res.send('Error in deleting session token');
			return console.error(err.message);
		}

		res.send('Session token deleted');
		console.log('Session token deleted');
	});
}

// Delete post
function deletePost(database: Database, res: Response, id: number) {
	database.run('DELETE FROM Posts WHERE ID = ?', id, (err) => {
		if (err) {
			res.send('Error in deleting post');
			return console.error(err.message);
		}

		res.send('Post deleted');
		console.log('Post deleted');
	});
}

export { deleteUser, deleteSessionToken, deletePost };
