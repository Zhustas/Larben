// Delete user
function deleteUser(database, res, id) {
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
function deleteSessionToken(database, res, sessionToken) {
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
function deletePost(database, res, id) {
	database.run('DELETE FROM Posts WHERE ID = ?', id, (err) => {
		if (err) {
			res.send('Error in deleting post');
			return console.error(err.message);
		}

		res.send('Post deleted');
		console.log('Post deleted');
	});
}

module.exports = { deleteUser, deleteSessionToken, deletePost };
