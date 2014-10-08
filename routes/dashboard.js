var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tweets = require('../models/tweet');
var UserController = require('../controllers/users');
var TweetController = require('../controllers/tweets');
var RelationshipController = require('../controllers/relationships');

/* GET: Dashboard page request */
router.get('/', function(req, res) {

	var authUser = req.session.user;
  var isAuth = req.session.user ? true: false;

    UserController.getAllUsers(function(e, users){
        var usrs = (e || !users) ? [] : users;
        TweetController.getAllTweetsByModDate(function(e, tweets){
          res.render('dashboard/dashboard', 
              {title: 'Dashboard', 
              'individuals': usrs,
              'frittertype': 'Current fritters',
              'tweets': tweets,
          	  'authUser': authUser,
              'isAuth': isAuth});
    
        });
    });
});


/*  GET: Dashboard of followed users page request */
router.get('/followed', function(req, res) {

  var authUser = req.session.user;
  var isAuth = req.session.user ? true: false;

  if (isAuth) {

    // Gets followed users
    RelationshipController.getFollowed(authUser, function(err, followed){
      list_of_followed = (err || !followed) ? [] : followed;

      // Ask tweet controller for tweets owned by these followed users
        TweetController.getTweetsOfUsers(list_of_followed, function(err, tweets){
          followed_tweets = (err || !tweets) ? [] : tweets;

          res.render('dashboard/dashboard', 
              {title: 'Followed Dashboard', 
              'individuals': list_of_followed,
              'frittertype': 'Followed',
              'tweets': followed_tweets,
              'authUser': authUser,
              'isAuth': isAuth});
        });
          
    });

  }
  // If user is not logged in, let them log in
  else {
    res.redirect('/login');
  }
});


module.exports = router;