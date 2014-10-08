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
							authUser: currentUser, 
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

// router.get('/', function(req, res){
// 	res.render('home/home');
// });

// router.get('/followers', function(req, res){
// 	RelationshipsController.getFollowers(currentUser, 
// 		function(e, followers){
// 			res.json(followers);
// 		});
// });


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

/* 	POST: Delete tweet request 
	accessed through AJAX
*/
router.post('/deletetweet/:id', function(req, res){
	var tweetId = req.params.id;

	// If remove tweet is successful, home page is shown, else error page
	TweetsController.removeTweet(tweetId, function(err, success){
		if (success) {
			res.send({success: true});
		}
		else {
			res.send({success: false});
		}
	});
	
});

/* 	POST: Edit tweet request 
	Accessed through AJAX
*/
router.post('/edittweet/:id', function(req, res){
	var tweetId = req.params.id;
	var msg = req.body.newmessage;

	// If edit is successful, home page is shown, else error
	TweetsController.editTweet(tweetId, msg, function(err, success){
		if (success) {
			res.send({success: true});
		}
		else {
			res.send({success: false});
		}
	});
});

/* 	POST: Retweet request 
	Accessed through AJAX
*/
router.post('/retweet', function(req, res){
	var tweetId = req.params.id;
	var msg = req.body.message;
	var owner = req.body.owner;

	var authuser = req.session.user;
	if (authuser){
		TweetsController.reTweet(owner, msg, authuser, function(err, success){
			if (success) {
				res.send({redirect: '/home', success: true});
			}
			else {
				res.send({redirect: null, success: false});
			}
		});
	}
	else {
		res.send({redirect: null, success: false});
	}
});

module.exports = router;