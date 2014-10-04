var express = require('express');
var router = express.Router();
var Messages = require('../models/message');
var MessagesController = require('../controllers/messages');

/* GET: Home page request */
router.get('/', function(req, res) {
	// Renders home page if logged in
	if (req.session.user){
		var currentUser = req.session.user;
		var messages = Messages.find({user: currentUser}, function(e, messages){
			res.render('home/home', 
	  			   {title: 'User Page', 
	  			    username: currentUser,
	  				messages: messages});
		});
	}
	// If not logged in, directs user to login
	else {
		res.redirect('/login');
	}
});


/* POST: Create message request */
router.post('/message', function(req, res){
	var msg = req.body.message;
	var userid = req.session.user;

	MessagesController.createMessage(userid, msg, function(success){
		if (success) res.redirect("/home");
		else res.render('error');
	})
});

/* POST: Delete message request */
router.post('/deletemessage/:id', function(req, res){
	var msgId = req.params.id;
	MessagesController.removeMessage(msgId, function(err, success){
		if (err) {
			console.log('messages delete error');
			// do something with error
		}
		else if (success) res.redirect('/home');
		else res.render('error');
	});
	
});

/* POST: Edit message request */
router.post('/editmessage/:id', function(req, res){
	var msgId = req.params.id;
	var msg = req.body.newmessage;

	MessagesController.editMessage(msgId, msg, function(err, success){
		if (err) {
			res.render('error');
		}
		else if (success) res.redirect('/home');
		else res.render('error');
	});
});

module.exports = router;