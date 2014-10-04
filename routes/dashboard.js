var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Messages = require('../models/message');

/* GET: Dashboard page request */
router.get('/', function(req, res) {
  	User.find({}, function(e, users){
  		if (e || !users) users = [];
  		Messages.find({}, function(e, messages){
  			res.render('dashboard/dashboard', 
  			   {title: 'Welcome to Fritter', 
  				'individuals': users,
  				'messages': messages});
  		});
  });
});


module.exports = router;