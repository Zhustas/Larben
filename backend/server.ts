import express from 'express';
import bodyParser from 'body-parser';
import { Database } from 'sqlite3';
require('dotenv').config();
var cookieParser = require('cookie-parser');

import { checkSessionTokenExists, validRequestBody } from './functions';
import {
	getUserBySessionToken,
	getUsers,
	getPosts,
	getMarkers,
	checkSessionTokenForExpiration
} from './get';
import { insertUser, checkCredentials, insertPost, insertMarker } from './post';
import { updateUser, updatePost } from './put';
import { deleteUser, deleteSessionToken, deletePost } from './delete';

const app = express();
const jsonParser = bodyParser.json();

app.use(cookieParser());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, POST');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

// ****************************************************************************
// **************************************************************************** Get methods
// ****************************************************************************

app.get('/user', (req, res) => {
	const sessionToken = req.cookies['sessionToken'];

	function callback(tokenExists: boolean) {
		if (tokenExists) {
			getUserBySessionToken(database, res, sessionToken);
		} else {
			res.send('Error');
		}
	}
	checkSessionTokenExists(database, sessionToken, callback);
});

app.get('/users', (req, res) => {
	getUsers(database, res);
	// const sessionToken = req.cookies['sessionToken'];

	// function callback(tokenExists: boolean) {
	// 	if (tokenExists) {
	// 		getUsers(database, res);
	// 	} else {
	// 		res.send('Error');
	// 	}
	// }
	// checkSessionTokenExists(database, sessionToken, callback);
});

app.get('/posts', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			getPosts(database, res);
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.get('/markers', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			getMarkers(database, res);
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.get('/checkSessionToken', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			checkSessionTokenForExpiration(database, res, sessionToken);
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

// ****************************************************************************
// **************************************************************************** Post methods
// ****************************************************************************

app.post('/user', jsonParser, (req, res) => {
	const expectations = {
		name: 'string',
		lastName: 'string',
		birthDate: 'date',
		username: 'string',
		email: 'string',
		password: 'string',
		description: 'string'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	insertUser(database, req, res);
});

app.post('/checkCredentials', jsonParser, (req, res) => {
	const expectations = {
		USERNAME: 'string',
		PASSWORD: 'string'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	const expirationTime = 1 * 60 * 1000; // 10 minutes

	checkCredentials(database, req, res, expirationTime);
});

app.post('/post', jsonParser, (req, res) => {
	const expectations = {
		USER_ID: 'int',
		TEXT: 'string',
		POST_DATETIME: 'datetime',
		LIKES: 'int'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	function callback(tokenExists: boolean) {
		if (tokenExists) {
			insertPost(database, req, res);
		} else {
			res.send('Ok');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.post('/marker', jsonParser, (req, res) => {
	const expectations = {
		USER_ID: 'int',
		DESCRIPTION: 'string',
		LATITUDE: 'double',
		LONGITUDE: 'double'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	function callback(tokenExists: boolean) {
		if (tokenExists) {
			insertMarker(database, req, res);
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

// ****************************************************************************
// **************************************************************************** Delete methods
// ****************************************************************************

app.delete('/user/:id', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			deleteUser(database, res, Number(req.params['id']));
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.delete('/sessionToken', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			deleteSessionToken(database, res, sessionToken);
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.delete('/post/:id', (req, res) => {
	function callback(tokenExists: boolean) {
		if (tokenExists) {
			deletePost(database, res, Number(req.params['id']));
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

// ****************************************************************************
// **************************************************************************** Put methods
// ****************************************************************************

app.put('/user/:id', jsonParser, (req, res) => {
	const expectations = {
		NAME: 'string',
		LAST_NAME: 'string',
		BIRTH_DATE: 'date',
		DESCRIPTION: 'string'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	function callback(tokenExists: boolean) {
		if (tokenExists) {
			updateUser(database, req, res, Number(req.params['id']));
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

app.put('/post/:id', jsonParser, (req, res) => {
	const expectations = {
		LIKES: 'int'
	};

	if (!validRequestBody(req, expectations)) {
		res.send('Error in request body');
		return;
	}

	function callback(tokenExists: boolean) {
		if (tokenExists) {
			updatePost(database, req, res, Number(req.params['id']));
		} else {
			res.send('Error');
		}
	}

	const sessionToken = req.cookies['sessionToken'];
	checkSessionTokenExists(database, sessionToken, callback);
});

// ****************************************************************************
// **************************************************************************** Main
// ****************************************************************************

function gracefulShutdown() {
	database.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Database closed');
	});

	server.close((err) => {
		if (err) {
			return console.error(err.message);
		}
	});
	console.log('Server closed');

	process.exit(0);
}

const port = 3000;
const database: Database = new Database('database/larben.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Database opened');
});

// const privateKey = fs.readFileSync("certificate/key.pem");
// const certificate = fs.readFileSync("certificate/certificate.pem");

// const server = https.createServer(
//   {
//     key: privateKey,
//     cert: certificate,
//     passphrase: process.env.CERTIFICATE_PASSPHRASE,
//   },
//   app
// );

const server = app.listen(port, () => {
	console.log(`Larben is listening on port ${port}`);
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
