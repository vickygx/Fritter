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
	// should i check userid = msg?
	Message.find({message_id: msgId}, function(e, message){
		if (e) fn(false);
		else {
			message.editMessage(msg);	
			fn(true);
		}
	});
}