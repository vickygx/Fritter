var express = require('express');
var router = express.Router();
var controller = require('../controllers/users');

/* GET: Landing page request */
router.get('/', function(req, res) {
  res.render('index', { title: 'Fritter' });
});

module.exports = router;

/* POST: Sign up request */
router.post('/signup', function(req, res){
	controller.createUser(req.body.username, req.body.password,
		function(success){
			if (success)
				controller.loginUser(req.body.username, req.body.password, req, res,
					function(success){
						if (success)
							res.redirect("/users/home");
						else 
							res.redirect("/users");			
					})
				
			else {
				res.render('index', 
  			   {title: 'Fritter', error: "Username is taken"});
			}
		});
});

/* GET: Signup page request */ 
router.get('/signup', function(req, res) {
  	res.render('index', { title: 'Fritter' });
});

/* Routes to login page */
router.get('/login', function(req, res){
	// If cookies do not exist, let them log in
	console.log(req.cookies);
	if (!req.cookies || !req.cookies.user || !req.cookies.pass ){
		res.render('index/login',
				  {title: 'Log in'});
	}
	// Try to log in with cookies 
	else {
		controller.loginUserWithCookie(req, function(success){
			if (success)
				res.redirect('users/home');
			else {
				res.render('index/login', {title: 'Log in'});
			}
		});
	}
});

/* Authenticates a user and signs them in */
router.post('/authenticate', function(req, res){
	controller.loginUser(req.body.username, req.body.password, req, res, function(success){
		if (success)
			res.redirect('users/home');
		else {
			res.render('index/login', 
	  			   			{title: 'Log in', error: "Username/Password is incorrect"});
		}
	});
});

/* Logs out a user */
router.post('/logout', function(req, res){
	res.clearCookie('user');
	res.clearCookie('pass');
	controller.clearSession(req);
	res.redirect('/');
});
