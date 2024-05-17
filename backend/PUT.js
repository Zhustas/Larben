// Update user
function updateUser(database, req, res, id) {
  const user = req.body;

  const sql = `
    UPDATE Users SET NAME = ?, LAST_NAME = ?, BIRTH_DATE = ?, DESCRIPTION = ? WHERE ID = ?
  `;

  const values = Object.values(user);

  database.run(sql, [...values, id], (err) => {
    if (err) {
      res.send("Error in updating user");
      return console.error(err.message);
    }

    res.send("User updated");
    console.log("User updated");
  });
}

// Update post
function updatePost(database, req, res, id) {
  const post = req.body;

  const sql = `
    UPDATE Posts SET LIKES = ? WHERE ID = ?
  `;

  const values = Object.values(post);

  database.run(sql, [...values, id], (err) => {
    if (err) {
      res.send("Error in updating post");
      return console.error(err.message);
    }

    res.send("Post updated");
    console.log("Post updated");
  });
}

module.exports = { updateUser, updatePost };
