var express = require('express');
var router = express.Router();
var controller = require('../controllers/users');

//  ------------------ GETTING PAGES ----------------------//

/* GET: Landing page request */
router.get('/', function(req, res) {
 	res.render('index/landing', { title: 'Fritter' });
});

/* GET: Signup page request */ 
router.get('/signup', function(req, res) {
  	res.render('index/landing', { title: 'Fritter' });
});

/* GET: Login page request */
router.get('/login', function(req, res){
	// If cookies do not exist, let them log in
	console.log(req.cookies);
	if (!req.cookies || !req.cookies.user || !req.cookies.pass ){
		res.render('index/login',
				  {title: 'Log in'});
	}
	// Try to log in with cookies 
	else {
		controller.loginUserWithCookie(req, function(err, success){
			// Show error
			if (err) res.render('error', {error: err});

			// If login worked with cookies, send them to home page
			else if (success)
				res.redirect('/home');

			// If login with cookies did not work, send them to login page
			else {
				res.render('index/login', {title: 'Log in'});
			}
		});
	}
});


//  ------------------ REQUESTING ----------------------//

/* POST: Sign up request */
router.post('/signup', function(req, res){
	controller.createUser(req.body.username, req.body.password,
		function(err, success){
			// If user was success, login the user
			if (success)
				controller.loginUser(req.body.username, req.body.password, req, res,
					function(err, success){
						if (err) res.render('error', {error: err});

						// If successful login, bring them to home page
						else if (success)
							res.redirect("/home");

						// Else, show them login page again
						else 
							res.redirect("/");			
					})

			// If error occured, show user error page
			else if (err){
				res.render('error', {error: err});
			}
			// If username taken error occured, notify user
			else {
				res.render('index/landing', 
  			   	{title: 'Fritter', error: "Username is taken"});
			}
		});
});

/* POST: Log out request*/
router.post('/logout', function(req, res){
	controller.logoutUser(req, res);
	res.redirect('/');
});

/* POST: Login request */
router.post('/authenticate', function(req, res){
	controller.loginUser(req.body.username, req.body.password, req, res, function(err, success){
		if (err) res.render('error', {error: err});
		
		// If successful login, bring user to home
		else if (success) res.redirect('/home');

		// If not successful, bring user back to login and display error
		else {
			res.render('index/login', 
	  			   	   {title: 'Log in', error: "Username/Password is incorrect"});
		}
	});
});

module.exports = router;