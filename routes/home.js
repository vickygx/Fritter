var express = require('express');
var router = express.Router();
var Tweets = require('../models/tweet');
var TweetsController = require('../controllers/tweets');
var RelationshipsController = require('../controllers/relationships');

/* GET: Home page request */
router.get('/', function(req, res) {
	
	// Renders home page if logged in
	if (req.session.user){
		var currentUser = req.session.user;

		// Getting followed users
		RelationshipsController.getFollowed(currentUser, function(e, followed){	
			var folowd = (e || !followed) ? [] : followed;

			// Getting followers
			RelationshipsController.getFollowers(currentUser, function(e, followers){
				var folowrs = (e || !followers) ? [] : followers;

				// Getting tweets
				TweetsController.getUserTweetsByModDate(currentUser,
					function(e, tweets){
						res.render('home/home', 
							{title: 'User Page', 
							username: currentUser, 
							tweets: tweets,
							followed: folowd,
							followers: folowrs});
					});
				});

			});
	}
	// If not logged in, directs user to login
	else {
		res.redirect('/login');
	}
});


/* POST: Create tweet request */
router.post('/tweet', function(req, res){
	var msg = req.body.message;
	var userid = req.session.user;

	// If tweet creation is success, home page is shown, else error page
	TweetsController.createTweet(userid, msg, function(err, success){
		if (success) res.redirect("/home");
		else {
			res.render('errorpage', {
				title: 'Sorry, our server could not process that request!', 
				message: "We have notified our engineers about your tweet creation problem."});
		}
	})
});

/* POST: Delete tweet request */
router.post('/deletetweet/:id', function(req, res){
	var tweetId = req.params.id;

	// If remove tweet is successful, home page is shown, else error page
	TweetsController.removeTweet(tweetId, function(err, success){
		if (err) {
			res.render('errorpage', {
				title: 'Sorry, our server could not process that request', 
				message: "We have notified our engineers about your tweet deletion problem."});
		}
		else if (success) res.redirect('/home');
		else // Show user not found page
			res.render('errorpage', {
				title: 'That tweet does not exist!', 
				message: "Please click on the bottom right to go back to home."});
	});
	
});

/* POST: Edit tweet request */
router.post('/edittweet/:id', function(req, res){
	var tweetId = req.params.id;
	var msg = req.body.newmessage;

	// If edit is successful, home page is shown, else error
	TweetsController.editTweet(tweetId, msg, function(err, success){
		if (success) res.redirect('/home');
		else {
			res.render('errorpage', {
				title: 'Our server could not process that request!', 
				message: "Please click on the bottom right to go back to home."});
		}
	});
});

module.exports = router;