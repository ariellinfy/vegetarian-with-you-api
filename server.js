const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'postgres',
	  password : 'Infinite7*',
	  database : 'vegetarian-with-you'
	}
  });

const signUp = require('./users-handler/sign-up');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('success');
});

// Create new user profile
app.post('/users/signup', signUp.handleSignUp(knex, bcrypt, jwt));

// User signin
app.post('/users/signin', (req, res) => {
	console.log(req.body);
	res.send('success');
});

// User signout
app.post('/users/signout', (req, res) => {
	console.log(req.body);
	res.send('success');
});

// Update user profile: name, location, avatar
// Upload user avatar
// Delete user avatar

// Update account info (email)

// Reset password

// Delete an user / close account






// Create a new restaurant

// Update existing restaurant info

// Get a specific restaurant info based on id, and all of its reviews

// Get restaurants (explore and find)


// Create a new review

// Update an existing review

// Images



app.listen(port, error => {
    if(error) throw error;
    console.log('Server running on port ' + port);
});