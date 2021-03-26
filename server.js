const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'postgres',
	  password : 'Infinite7*',
	  database : 'vegetarian-with-you'
	}
  });

const auth = require('./users-handler/auth');
const signUp = require('./users-handler/sign-up');
const signIn = require('./users-handler/sign-in');
const signOut = require('./users-handler/sign-out');
const editProfile = require('./users-handler/edit-profile');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('success');
});

// User sign-up / new user profile
app.post('/users/signup', signUp.handleSignUp(knex, bcrypt));

// User sign-in
app.post('/users/signin', signIn.handleSignIn(knex, bcrypt));

// User sign-out
app.post('/users/signout', auth, signOut.handleSignOut());

// Update user profile: name, location
app.post('/users/editprofile', auth, editProfile.handleEditProfile(knex));

// Upload/update user avatar
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