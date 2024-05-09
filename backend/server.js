const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const crypto = require("crypto-js");
const dotenv = require("dotenv").config();

const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const AES_KEY = process.env.AES_KEY;

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
    });
  }

  getUsers(res) {
    this.#database?.all(`SELECT * FROM Users`, (err, rows) => {
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
        res.json(row);
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

  close() {
    this.#database?.close((err) => {
      if (err) {
        return console.error(err.message);
      }
    });
  }
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  // res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/users", jsonParser, (req, res) => {
  const db = new Database("database/larben.db");
  db.open();
  db.getUsers(res);
  db.close();
});

app.post("/register", jsonParser, (req, res) => {
  const db = new Database("database/larben.db");
  db.open();
  db.insertUser(req, res);
  db.close();
});

app.post("/getUserByCredentials", jsonParser, (req, res) => {
  const db = new Database("database/larben.db");
  db.open();
  db.checkCredentials(req, res);
  db.close();
});

app.listen(port, () => {
  console.log(`Larben is listening on port ${port}`);
});
