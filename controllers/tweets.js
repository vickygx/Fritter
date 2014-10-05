/* 	Controller that takes care of all the functionalities 
	related to the Tweets database and the corresponding view.
*/

var mongoose = require('mongoose');
var Tweet = require('../models/tweet');
module.exports = {};

/*	Creates an instance of Tweet with the msg text 
	and owner as the User with id=userid.

	fn: callback function after Tweet is saved
		fn(err, success)
*/
module.exports.createTweet = function(userid, msg, fn){
	// Create a Tweet data object
	var newTweet = new Tweet({
		owner: userid,
		message: msg, 
		created: Date.now(),
		modified: Date.now()
	});

	// Save the Tweet in the database
	newTweet.save(function(err) {
		if (err) fn(err, false);
		else fn(null, true);
	});	
}

/*	Edits a Tweet object with the _id=tweetId by
	setting message=msg.

	fn: callback function after Tweet is updated
		fn(err,success) 
*/
module.exports.editTweet = function(tweetId, msg, fn){
	Tweet.findOneAndUpdate(
		{_id: tweetId}, 
		{message: msg, modified: Date.now()},
		{upsert: true}, 
		function(err, tweet){
			if (err) fn(err, false);
			else if (tweet) fn(null, true);
			else fn(null, false);

		});
}

/*	Remove a Tweet object with the _id=tweetId

	fn: callback function after Tweet is updated
		fn(err,success) 
*/
module.exports.removeTweet = function(tweetId, fn){
	Tweet.findOneAndRemove(
		{_id: tweetId}, 
		function(err, tweet){
			if (err) fn(err, false);
			else if (tweet) fn(null, true);
			else fn(null, false);
		});
}

module.exports.getUsersAndTweets


/* 	Gets the Tweet objects of the given user with
	username=username and sort it by modification date */
module.exports.getUserTweetsByModDate = function(username, fn){
	return Tweet.find({owner: username})
		.sort('-modified')
		.exec(fn);
}

/*	Gets the Tweet objects with the given username 
*/
module.exports.getUserTweets = function(username, fn){
	return Tweet.find({owner: username}, fn);
}

/*	Gets all the Tweet objects sorted by mod date
*/
module.exports.getAllTweetsByModDate = function(fn){
	return module.exports.getTweetsByModDate({}, fn);
}

/*	Gets the Tweet objects with the given parameters 
*/
module.exports.getTweetsByModDate = function(param, fn){
	return Tweet.find(param)
		.sort('-modified')
		.exec(fn);
}

/*	Gets the Tweet objects with the given parameters 
*/
module.exports.getTweets = function(params, fn){
	return Tweet.find(params, fn);
}
