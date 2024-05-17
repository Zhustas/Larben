// Check if given sessionToken exists in database
function checkSessionTokenExists(database, sessionToken, callback) {
  const sql = "SELECT * FROM SessionTokens WHERE TOKEN = ?";

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
function validRequestBody(body, expectations) {
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

  // Bad data types
  for (const key of bodyKeys) {
    if (expectations[key] === "int" || expectations[key] === "double") {
      // Expected number
      if (typeof body[key] !== "number") {
        return false;
      }
    } else if (
      expectations[key] === "date" ||
      expectations[key] === "datetime"
    ) {
      // Expected date
      let date = new Date(body[key]);
      if (isNaN(date.getTime()) && body[key] !== null) {
        return false;
      }
    }
  }

  return true;
}

module.exports = { checkSessionTokenExists, validRequestBody };
