const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'postgres',
	  password : 'Infinite7*',
	  database : 'vegetarian-with-you'
	}
  });

const storageAvatar = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads/users');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const uploadAvatarMD = multer({ 
	storage: storageAvatar,
	limits: {
		fileSize: 1000000 // max 1MB
	},
	fileFilter (req, file, cb) { 
		if (!file.mimetype.match(/^image/)) {
			cb(new Error().message = 'incorrect file type');
		}
		if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
			return cb(new Error('Please upload a valid photo. Format should be one of: jpg, jpeg or png.'))
		};
		cb(null, true);
	  }
});

const storagePhotos = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads/restaurants');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' +file.originalname);
	}
});

const uploadPhotosMD = multer({ 
	storage: storagePhotos,
	limits: {
		fileSize: 3000000 // max 3MB
	},
	fileFilter (req, file, cb) { 
		if (!file.mimetype.match(/^image/)) {
			cb(new Error().message = 'incorrect file type');
		}
		if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
			return cb(new Error('Please upload a valid photo. Format should be one of: jpg, jpeg or png.'))
		};
		cb(null, true);
	  }
});

const auth = require('./users-handler/auth');
const checkUserSession = require('./users-handler/check-user-session');
const refreshToken = require('./users-handler/refresh-token');
const signUp = require('./users-handler/sign-up');
const signIn = require('./users-handler/sign-in');
const signOut = require('./users-handler/sign-out');
const editProfile = require('./users-handler/edit-profile');
const uploadAvatar = require('./users-handler/upload-avatar');
const deleteAvatar = require('./users-handler/delete-avatar');
const updateEmail = require('./users-handler/update-email');
const resetPassword = require('./users-handler/reset-password');
const closeAccount = require('./users-handler/close-account');

const createRestaurant = require('./restaurants-handler/create-restaurant');
const updateRestaurant = require('./restaurants-handler/update-restaurant');
const requestAllRestaurants = require('./restaurants-handler/request-all-restaurants');
const requestRestaurantById = require('./restaurants-handler/request-restaurant-by-id');

const createReview = require('./reviews-handler/create-review');
const updateReview = require('./reviews-handler/update-review');
const requestRestaurantReviews = require('./reviews-handler/request-restaurant-reviews');
const requestRestaurantReviewsWithAuth = require('./reviews-handler/request-restaurant-reviews-with-auth');
const requestUserReviews= require('./reviews-handler/request-user-reviews');
const reviewHelpful = require('./reviews-handler/review-helpful');
const reportReview = require('./reviews-handler/report-review');
const deleteReview = require('./reviews-handler/delete-review');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('success');
});

// Request user
app.get('/users', auth, checkUserSession.handleCheckUserSession(knex));

// Refresh token
app.get('/users/refreshtoken', auth, refreshToken.handleRefreshToken());

// User sign-up / new user profile
app.post('/users/signup', signUp.handleSignUp(knex, bcrypt));

// User sign-in
app.post('/users/signin', signIn.handleSignIn(knex, bcrypt));

// User sign-out
app.post('/users/signout', auth, signOut.handleSignOut());

// Update user profile: name, location
app.patch('/users/editprofile', auth, editProfile.handleEditProfile(knex));

// Upload/update user avatar
app.post('/users/uploadavatar', auth, uploadAvatarMD.single('avatar'), uploadAvatar.handleUploadAvatar(knex));

// Delete user avatar
app.delete('/users/deleteavatar', auth, deleteAvatar.handleDeleteAvatar(knex));

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
app.post('/onreview/createreview', auth, uploadPhotosMD.array('photoNew'), createReview.handleCreateReview(knex));

// Update an existing review
app.patch('/onreview/updatereview', auth, uploadPhotosMD.array('photoNew'), updateReview.handleUpdateReview(knex));

// Request all reviews based on restaurant id (no auth)
app.get('/reviews', requestRestaurantReviews.handleRequestRestaurantReviews(knex));

// Request all reviews based on restaurant id (with auth)
app.get('/reviews/auth', auth, requestRestaurantReviewsWithAuth.handleRequestRestaurantReviewsWithAuth(knex));

// Request all reviews based on user id
app.get('/reviews/user', auth, requestUserReviews.handleRequestUserReviews(knex));

// Images


// Review helpful
app.patch('/onreview/reviewhelpful', auth, reviewHelpful.handleReviewHelpful(knex));

// Review report
app.patch('/onreview/reportreview', auth, reportReview.handleReportReview(knex));

// Delete review
app.delete('/onreview/deletereview', auth, deleteReview.handleDeleteReview(knex));


app.listen(port, error => {
    if(error) throw error;
    console.log('Server running on port ' + port);
});