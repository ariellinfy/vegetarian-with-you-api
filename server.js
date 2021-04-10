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
const resetPassword = require('./users-handler/reset-password');
const updateEmail = require('./users-handler/update-email');
const closeAccount = require('./users-handler/close-account');

const createRestaurant = require('./restaurants-handler/create-restaurant');
const updateRestaurant = require('./restaurants-handler/update-restaurant');
const requestAllRestaurants = require('./restaurants-handler/request-all-restaurants');
const requestRestaurantById = require('./restaurants-handler/request-restaurant-by-id');

const createReview = require('./reviews-handler/create-review');
const updateReview = require('./reviews-handler/update-review');
const requestRestaurantReviews = require('./reviews-handler/request-restaurant-reviews');
const requestUserReviews= require('./reviews-handler/request-user-reviews');
const reviewHelpful = require('./reviews-handler/review-helpful');
const reportReview = require('./reviews-handler/report-review');
const deleteReview = require('./reviews-handler/delete-review');

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
app.patch('/users/editprofile', auth, editProfile.handleEditProfile(knex));

// Upload/update user avatar
// Delete user avatar

// Update email
app.patch('/users/updateemail', auth, updateEmail.handleUpdateEmail(knex));

// Reset password
app.patch('/users/resetpassword', auth, resetPassword.handleResetPassword(knex, bcrypt));

// Delete an user / close account
app.delete('/users/closeaccount', auth, closeAccount.handleCloseAccount(knex, bcrypt));


// Create a new restaurant
app.post('/onrestaurant/createrestaurant', auth, createRestaurant.handleCreateRestaurant(knex));

// Update existing restaurant info
app.patch('/onrestaurant/updaterestaurant', auth, updateRestaurant.handleUpdateRestaurant(knex));

// Request all restaurants
app.get('/restaurants', requestAllRestaurants.handleRequestAllRestaurants(knex));

// Request restaurant by id
app.get('/restaurants/:id', requestRestaurantById.handleRequestRestaurantById(knex));


// Create a new review
app.post('/onreview/createreview', auth, createReview.handleCreateReview(knex));

// Request all reviews based on restaurant id
app.get('/reviews', requestRestaurantReviews.handleRequestRestaurantReviews(knex));

// Request all reviews based on user id
app.get('/reviews/user', auth, requestUserReviews.handleRequestUserReviews(knex));

// Update an existing review
app.patch('/onreview/updatereview', auth, updateReview.handleUpdateReview(knex));

// Images

// Review helpful
app.patch('/onreview/reviewhelpful', auth, reviewHelpful.handleReviewHelpful(knex));

// Review report
app.patch('/onreview/reportreview', auth, reportReview.handleReportReview(knex));

// Delete review
app.delete('/onreview/deletereview', auth, deleteReview.handleDeleteReview(knex, bcrypt));


app.listen(port, error => {
    if(error) throw error;
    console.log('Server running on port ' + port);
});