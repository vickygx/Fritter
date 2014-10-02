var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Messages = require('../models/message');
var MessagesController = require('../controllers/messages');


/* Gets a list of all users */
router.get('/', function(req, res) {
  User.find({}, function(e, users){
  	res.render('users/user', 
  			   {title: 'Welcome to Fritter', 
  				'individuals': users});
  });
});


/* Route to message page  (show and create) */
router.get('/home', function(req, res) {
	console.log(req.session);
	if (req.session.user){
		// if not logged in, shows all users
		var currentUser = req.session.user;
		var messages = Messages.find({user: currentUser}, function(e, messages){
			res.render('users/home', 
	  			   {title: 'User Page', 
	  			    username: currentUser,
	  				messages: messages});
		});
	}
	else {
		res.redirect('/users');
	}

});


/* Creates a message */
router.post('/message', function(req, res){
	var msg = req.body.message;
	var userid = req.session.user;

	MessagesController.createMessage(userid, msg, function(success){
		if (success) res.redirect("home");
		else res.redirect(404);
	})
});

router.post('/deletemessage', function(req, res){
	var msgId = 123;
	Messages.remove({message_id: msgId}, function(err){});
});

router.post('/editmessage', function(req, res){
	// get messageid somehow
	var msgId = 1213;
	var msg = req.body.message;

	MessagesController.editMessage(msgId, msg, function(success){
		if (success) res.redirect('home');
		else res.redirect(404);
	});
});

module.exports = router;
