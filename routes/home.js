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

	// If message is success, home page is shown, else error page
	MessagesController.createMessage(userid, msg, function(err, success){
		if (success) res.redirect("/home");
		else res.render('error', {error: err});
	})
});

/* POST: Delete message request */
router.post('/deletemessage/:id', function(req, res){
	var msgId = req.params.id;

	// If remove message is successful, home page is shown, else error page
	MessagesController.removeMessage(msgId, function(err, success){
		if (err) res.render('error', {error: err});
		else if (success) res.redirect('/home');
		else res.render('error');
	});
	
});

/* POST: Edit message request */
router.post('/editmessage/:id', function(req, res){
	var msgId = req.params.id;
	var msg = req.body.newmessage;

	// If edit is successful, home page is shown, else error
	MessagesController.editMessage(msgId, msg, function(err, success){
		if (success) res.redirect('/home');
		else res.render('error', {error: err});
	});
});

module.exports = router;