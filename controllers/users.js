/* 	Controller that takes care of all the functionalities 
	related to the users database and the corresponding view.
*/

var mongoose = require('mongoose');
var User = require('../models/user');
module.exports = {};


/* 	Function to create a User with username user_name and
	password pass_word, and save it into the database.

	fn: A callback function that takes in a boolean representing
		success of failure.
		fn(err, success)
*/
module.exports.createUser = function(user_name, pass_word, fn){
	// Creates a new user
	var newUser = new User({
		username: user_name,
		password: pass_word
	});

	// Save the new user in the database
	newUser.save(function(err) {
		if (err){ 
			// If error is that username is taken, send back false
			if (err.code === 11000){
				fn(null, false);
			}
			// Else, send back error
			else fn(err, false);
		}
		else fn(null, true);
	});		
}

/* 	Function to create to log a user in with the request's cookies
	fn: A callback function that takes in a boolean representing
		success of failure.
	
	If the cookies exist and are correct, it will set a new user session, 
	and call fn(err,true)
	If not, it will clear the cookies and call fn(err,false) 
*/
module.exports.loginUserWithCookie = function(req, res, fn){
	if (!req.cookies)
		return fn(null,false);

	// Tries to authenticate user with cookie paramters
	module.exports.authenticateUser(req.cookies.user, req.cookies.pass, 
		function(err, isMatch){
			if (err) fn(err,false);

			// If it works, it sets new user session
			if (isMatch){
				module.exports.setUserSession(req.cookies.user, req);	
				fn(null,true);
			} 
			// If it doesn't, it clears the cookies
			else {
				res.clearCookie('user');
				res.clearCookie('pass');
				module.exports.clearSession(req);
				fn(null,false);
			}	
		});
}

/* 	Function to create to log a user in with username un and password pw
	fn: A callback function that takes in a boolean representing
		success of failure.
	
	If the un/pw combo is correct, it will set the cookies and session
		and call fn(null,true)

	If not, it will call fn(err,false) 
*/
module.exports.loginUserInput = function(un, pw, req, res, fn){
	module.exports.authenticateUser(un, pw,
		function(err, isMatch){
			// If error
			if (err) fn(err, false);
			// If there is a match, set user session and cookies
			if (isMatch){
				// Sets cookies and session
				res.cookie('user', un, {maxAge: 900000});
				res.cookie('pass', pw, {maxAge: 900000});
				module.exports.setUserSession(un, req);
				fn(null,true);
			}
			// If it is not a database error, but it does not match
			else {
				fn(null,false);
			}
		});
}
/* 	Function to create log out a user
*/
module.exports.logoutUser = function(req, res){
	res.clearCookie('user');
	res.clearCookie('pass');
	module.exports.clearSession(req);
}

/* 	Helper function for logging in users (either with cookie or normally)
	Function to check if the user exists and the password is correct
	
	user_name is the username of user to test
   	pass_word is the password to authenticate with
   	fn is a callback function which takes (error, isMatch) as a result 
*/
module.exports.authenticateUser = function(user_name, pass_word, fn){
	User.findOne({username: user_name},
		function(err, user){
			if (err)
				return fn(err, false);
			else if (user)
				// user exists
				return user.comparePassword(pass_word, fn);	
			else 
				return fn(null, false);
		});
}

/*	Gets a list of all the existing users 
*/
module.exports.getAllUsers = function(fn){
	return User.find({}, fn);
}

/*	Gets a single user object with username 
*/
module.exports.getUser = function(username, fn){
	return User.find({username: username}, fn);
}


/* 	Function to create to set a user session
*/
module.exports.setUserSession = function(user_name, req){
	req.session.user = user_name;
}

/* 	Function to clear a user session
*/
module.exports.clearSession = function(req){
	req.session.destroy();
}