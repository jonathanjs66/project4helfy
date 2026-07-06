const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const log4js = require('log4js');
require('dotenv').config();

const app = express();



log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'all-logs.log' } 
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
});

const logger = log4js.getLogger();

logger.debug("logerDebug.log");


const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

connection.connect((error) => {
	if (error) {
        
		logger.error('MySQL connection failed:', error);
		return;
	}

	logger.info('Connected to MySQL');
});

app.use(session({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/auth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;

	if (!username || !password) {
		return response.send('Please enter Username and Password!');
	}

	connection.query(
		'SELECT * FROM accounts WHERE username = ? AND password = ?',
		[username, password],
		function(error, results) {
			if (error) {
				logger.error('Database query failed:', error);
				return response.status(500).send('Database error');
			}

			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				return response.redirect('/home');
			}

			return response.send('Incorrect Username and/or Password!');
		}
	);
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		return response.send('Welcome back, ' + request.session.username + '!');
	}

	return response.send('Please login to view this page!');
});

app.listen(3000, '0.0.0.0', () => {
	logger.info ('Server started on port 3000');
});