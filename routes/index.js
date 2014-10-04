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
		controller.loginUserWithCookie(req, function(success){
			if (success)
				res.redirect('/home');
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
		function(success){
			if (success)
				controller.loginUser(req.body.username, req.body.password, req, res,
					function(success){
						if (success)
							res.redirect("/home");
						else 
							res.redirect("/");			
					})
				
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

/* POST: Sign in request */
router.post('/authenticate', function(req, res){
	controller.loginUser(req.body.username, req.body.password, req, res, function(success){
		if (success)
			res.redirect('/home');
		else {
			res.render('index/login', 
	  			   	   {title: 'Log in', error: "Username/Password is incorrect"});
		}
	});
});

module.exports = router;