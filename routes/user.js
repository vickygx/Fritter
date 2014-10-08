var express = require('express');
var router = express.Router();
var Tweets = require('../models/tweet');
var UserController = require('../controllers/users');
var TweetsController = require('../controllers/tweets');
var RelationshipsController = require('../controllers/relationships');

/* GET: Home page request */
router.get('/:username', function(req, res) {
	var username = req.params.username;
	var authUser = req.session.user;
	var isAuth = authUser ? true : false;
	var isFollowing = false;
	if (authUser){
		RelationshipsController.isFollowing(req.session.user, username, function(result){
			isFollowing = result;
		});
	}
	// TODO: maybe reorg?? not sure if concurrency thing

	UserController.getUser(username, function(e, user){
		// Loads user's page if user exists
		if (user && user.length !== 0){
			TweetsController.getUserTweetsByModDate(username, 
				function(e, tweets){
					res.render('users/user', 
						{title: username,
						 username: username, 
						 tweets: tweets,
						 tweetnum: tweets.length,
						 authUser: authUser,
						 isAuth: isAuth,
						 isFollowing: isFollowing});
				});
		}
		else {
			// Show user not found page
			res.render('errorpage', {
				title: 'Page not found', 
				message: "There is no one with that username!"});
		}

	});
	
});


/* POST: Follow user request */
router.post('/follow', function(req, res){
	var followee = req.body.followee;
	var follower = req.session.user;
	
	// If user is logged in, let follower follow followee
	if (follower){
		RelationshipsController.follow(follower, followee, function(err, success){
			if (success) res.send({success: true});
			else res.send({success: false});
		});
	}

	// If user is not logged in, send them to login page
	else {
		res.redirect('/login');
	}
});

/* POST: Unfollow user request */
router.post('/unfollow', function(req, res){
	var followee = req.body.followee;
	var follower = req.session.user;
	
	// If user is logged in, let follower unfollow followee
	if (follower){
		RelationshipsController.unfollow(follower, followee, function(err, success){
			if (success) res.send({success: true});
			else res.send({success: false});
		});
	}

	// If user is not logged in, send them to login page
	else {
		res.redirect('/login');
	}
});


module.exports = router;