const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const crypto = require("crypto-js");
const dotenv = require("dotenv").config();
var cookieParser = require("cookie-parser");

class Database {
  #filename;
  #database;

  constructor(filename) {
    this.#filename = filename;
  }

  open() {
    this.#database = new sqlite3.Database(this.#filename, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Database opened");
    });
  }

  // ******************************************* GET METHODS ********************************

  getUsers(res) {
    this.#database?.all("SELECT * FROM Users", (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      }

      rows = [
        {
          identification: crypto.lib.WordArray.random(32).toString(),
        },
        ...rows,
      ];
      res.json(rows);
    });
  }

  getPosts(res) {
    this.#database?.all("SELECT * FROM Posts", (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      }

      if (rows) {
        rows = [
          {
            identification: crypto.lib.WordArray.random(32).toString(),
          },
          ...rows,
        ];
        res.json(rows);
      }
    });
  }

  // ****************************************************************************************
  // ******************************************* POST METHODS *******************************

  checkSessionTokenForExpiration(res) {
    // Get user ID
    const { USER_ID } = res.body;

    // SQL for checking Session Token expiration
    const sql = `
      SELECT * FROM SessionTokens WHERE
    `;
  }

  insertSessionToken(USER_ID) {
    // SQL for inserting Session Token
    const sql = `
      INSERT INTO SessionTokens(USER_ID, TOKEN, TOKEN_CREATED)
      VALUES (?, ?, ?);
    `;

    // Session Token values
    const values = [
      USER_ID,
      crypto.lib.WordArray.random(32).toString(),
      new Date(),
    ];

    // Insert Session Token
    this.#database?.run(sql, values, (err) => {
      if (err) {
        return console.error(err);
      }

      console.log("Session Token added");
    });

    return values[1];
  }

  checkCredentials(req, res) {
    // Get username and password
    const { USERNAME: username, PASSWORD: password } = req.body;

    // SQL for finding user
    const sql = `SELECT * FROM Users WHERE USERNAME = ? AND PASSWORD = ?`;

    // Find first row where username and password matches
    this.#database.get(sql, [username, password], (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      if (row) {
        const token = this.insertSessionToken(row["ID"]);

        const plus3Hours = 3 * 60 * 60 * 1000;
        const expirationTime = 10 * 60 * 1000;

        res
          .cookie("sessionToken", token, {
            maxAge: plus3Hours + expirationTime,
            path: "/",
            secure: false,
            domain: "localhost",
          })
          .send("ok");
      } else {
        res.status(401).send("Unauthorized");
      }
    });
  }

  insertUser(req, res) {
    // Get user object from json
    const user = req.body;

    // Create SQL text
    const sql = `
      INSERT INTO Users (NAME, LAST_NAME, BIRTH_DATE, USERNAME, EMAIL, PASSWORD, GUILD_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    // Get only values from user object
    const values = Object.values(user).map((value) => value);

    // Insert user
    this.#database?.run(sql, values, (err) => {
      if (err?.errno === 19) {
        res.status(409).send(err.message);
        return;
      }

      res.send("Ok");
      console.log("User added");
    });
  }

  insertPost(req, res) {
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
    this.#database.run(sql, values, (err) => {
      if (err) {
        return console.error(err.message);
      }

      res.send("Ok");
      console.log("Post added");
    });
  }

  // ****************************************************************************************

  close() {
    this.#database?.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Database closed");
    });
  }
}

const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const AES_KEY = process.env.AES_KEY;

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  // res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ******************************************* POST METHODS *******************************

app.get("/users", jsonParser, (req, res) => {
  database.getUsers(res);
});

app.get("/posts", jsonParser, (req, res) => {
  database.getPosts(res);
});

// ******************************************************************************************
// ******************************************* POST METHODS *********************************

app.post("/register", jsonParser, (req, res) => {
  database.insertUser(req, res);
});

app.post("/checkCredentials", jsonParser, (req, res) => {
  database.checkCredentials(req, res);
});

app.post("/insertPost", jsonParser, (req, res) => {
  database.insertPost(req, res);
});

// ******************************************************************************************

function gracefulShutdown() {
  database.close();

  console.log("Closing server");
  server.close();
}

const database = new Database("database/larben.db");
database.open();

const server = app.listen(port, () => {
  console.log(`Larben is listening on port ${port}`);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
