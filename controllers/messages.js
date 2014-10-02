/* 	Controller that takes care of all the functionalities 
	related to the users database and the corresponding view.
*/

//	Module dependencies 
var mongoose = require('mongoose');
var Message = require('../models/message');
module.exports = {};

module.exports.createMessage = function(userid, msg, fn){
	// Create a message data object
	var newMessage = new Message({
		user: userid,
		message_id: 0,
		message: msg, 
		created: Date.now(),
		modified: Date.now()
	});

	// Save the message in the database
	newMessage.save(function(err) {
		if (err) fn(false);
		else fn(true);
	});	
}

module.exports.editMessage = function(msgId, msg, fn){
	Message.findOneAndUpdate(
		{_id: msgId}, 
		{message: msg, modified: Date.now()},
		{upsert: true}, 
		function(err, msg){
			if (err)
				fn(err, false);
			else if (msg)
				fn(null, true);
			else fn(null, false);

		});
}

module.exports.removeMessage = function(msgId, fn){
	Message.findOneAndRemove(
		{_id: msgId}, 
		function(err, msg){
			if (err) fn(err, false);
			else if (msg) fn(null, true);
			else fn(null, false);
		});
}