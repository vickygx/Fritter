/* 	Controller that takes care of all the functionalities 
	related to the Relationships database 
*/

var mongoose = require('mongoose');
var Relationship = require('../models/relationship');
var User = require('../models/user');
module.exports = {};

/*	Creates an instance of follower-folloee relationship
	Both follower and followee should correspond to
	existing usernames in User

	fn: callback function after the relationship is saved
		fn(err, success)
*/
module.exports.follow = function(follower, followee, fn){
	// Check if user exists

	// Create a Relationship data object
	var newRelationship = new Relationship({
		followee: followee,
		follower: follower,
	});

	// Save the Tweet in the database
	newRelationship.save(function(err) {
		if (err) fn(err, false);
		else fn(null, true);
	});	
}

/*	Backend request for follower to unfolow followee

	fn: callback function after relationship is updated
		fn(err,success) 
*/
module.exports.unfollow = function(follower, followee, fn){
	Relationship.findOneAndRemove(
		{follower: follower,
		 followee: followee}, 
		function(err, relate){
			console.log("Trying to remove it and result:", relate);
			if (err) fn(err, false);
			else if (relate) fn(null, true);
			else fn(null, false);
		});
}


module.exports.getFollowers = function(username, fn){
	return Relationship.find({followee: username}, fn);
}

module.exports.getFollowed = function(username, fn){
	return Relationship.find({follower: username}, fn);
}

module.exports.isFollowing = function(follower, followee, fn){
	Relationship.find({follower: follower, followee: followee}, 
		function(e, relate){
			console.log("Trying to find it and result is:", relate);
			if (e || !relate || relate.length === 0) return fn(false);
			return fn(true);
	});
}

module.exports.getUsersAndTweets

