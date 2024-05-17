const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const https = require("https");
const fs = require("fs");
var cookieParser = require("cookie-parser");

const { checkSessionTokenExists, validRequestBody } = require("./functions.js");
const {
  getUserBySessionToken,
  getUsers,
  getPosts,
  getMarkers,
  checkSessionTokenForExpiration,
} = require("./GET.js");
const {
  insertUser,
  checkCredentials,
  insertPost,
  insertMarker,
} = require("./POST.js");
const { updateUser, updatePost } = require("./PUT.js");
const { deleteUser, deleteSessionToken, deletePost } = require("./DELETE.js");

const app = express();
const jsonParser = bodyParser.json();

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Get methods
app.get("/user", (req, res) => {
  const sessionToken = req.cookies["sessionToken"];

  function callback(tokenExists) {
    if (tokenExists) {
      getUserBySessionToken(database, res, sessionToken);
    } else {
      res.send("Error");
    }
  }
  checkSessionTokenExists(database, sessionToken, callback);
});

app.get("/users", (req, res) => {
  const sessionToken = req.cookies["sessionToken"];

  function callback(tokenExists) {
    if (tokenExists) {
      getUsers(database, res);
    } else {
      res.send("Error");
    }
  }
  checkSessionTokenExists(database, sessionToken, callback);
});

app.get("/posts", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      getPosts(database, res);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.get("/markers", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      getMarkers(database, res);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.get("/checkSessionToken", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      checkSessionTokenForExpiration(database, req, res, sessionToken);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

// Post methods
app.post("/user", jsonParser, (req, res) => {
  const expectations = {
    NAME: "string",
    LAST_NAME: "string",
    BIRTH_DATE: "date",
    USERNAME: "string",
    EMAIL: "string",
    PASSWORD: "string",
    DESCRIPTION: "string",
  };

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  insertUser(database, req, res);
});

app.post("/checkCredentials", jsonParser, (req, res) => {
  const expectations = {
    USERNAME: "string",
    PASSWORD: "string",
  };

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  const expirationTime = 1 * 60 * 1000; // 10 minutes

  checkCredentials(database, req, res, expirationTime);
});

app.post("/post", jsonParser, (req, res) => {
  const expectations = {
    USER_ID: "int",
    TEXT: "string",
    POST_DATETIME: "datetime",
    LIKES: "int",
  };

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  function callback(tokenExists) {
    if (tokenExists) {
      insertPost(database, req, res);
    } else {
      res.send("Ok");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.post("/marker", jsonParser, (req, res) => {
  const expectations = {
    USER_ID: "int",
    DESCRIPTION: "string",
    LATITUDE: "double",
    LONGITUDE: "double",
  };

  console.log("asss");

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  console.log("as");

  function callback(tokenExists) {
    if (tokenExists) {
      insertMarker(database, req, res);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

// Delete methods
app.delete("/user/:id", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      deleteUser(database, res, req.params["id"]);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.delete("/sessionToken", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      deleteSessionToken(database, res, sessionToken);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.delete("/post/:id", (req, res) => {
  function callback(tokenExists) {
    if (tokenExists) {
      deletePost(database, res, req.params["id"]);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

// Put methods
app.put("/user/:id", jsonParser, (req, res) => {
  const expectations = {
    NAME: "string",
    LAST_NAME: "string",
    BIRTH_DATE: "date",
    DESCRIPTION: "string",
  };

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  function callback(tokenExists) {
    if (tokenExists) {
      updateUser(database, req, res, req.params["id"]);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

app.put("/post/:id", jsonParser, (req, res) => {
  const expectations = {
    LIKES: "int",
  };

  if (!validRequestBody(req.body, expectations)) {
    res.send("Error in request body");
    return;
  }

  function callback(tokenExists) {
    if (tokenExists) {
      updatePost(database, req, res, req.params["id"]);
    } else {
      res.send("Error");
    }
  }

  const sessionToken = req.cookies["sessionToken"];
  checkSessionTokenExists(database, sessionToken, callback);
});

function gracefulShutdown() {
  database.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Database closed");
  });

  server.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  console.log("Server closed");

  process.exit(0);
}

const port = 3000;
const database = new sqlite3.Database("database/larben.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Database opened");
});

const privateKey = fs.readFileSync("key.pem");
const certificate = fs.readFileSync("certificate.pem");

const server = https.createServer(
  { key: privateKey, cert: certificate, passphrase: "MonAmour" },
  app
);

server.listen(port, () => {
  console.log(`Larben is listening on port ${port}`);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// openssl genrsa -aes256 -out key.pem 4096
// openssl req -new -sha256 -subj "/CN=localhost" -key key.pem -out request.csr
// openssl x509 -req -sha256 -days 90 -in request.csr -signkey key.pem -out certificate.pem
