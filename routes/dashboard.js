var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tweets = require('../models/tweet');
var UserController = require('../controllers/users');
var TweetController = require('../controllers/tweets');

/* GET: Dashboard page request */
router.get('/', function(req, res) {

	var authUser = req.session.user;

    UserController.getAllUsers(function(e, users){
        var usrs = (e || !users) ? [] : users;
        TweetController.getAllTweetsByModDate(function(e, tweets){
          res.render('dashboard/dashboard', 
              {title: 'Welcome to Fritter', 
              'individuals': usrs,
              'tweets': tweets,
          	  'authUser': authUser});
    
        });
    });
});


module.exports = router;