/* 	Controller that takes care of all the functionalities 
	related to the messages database and the corresponding view.
*/

var mongoose = require('mongoose');
var Message = require('../models/message');
module.exports = {};

/*	Creates an instance of Message with the msg text 
	and owner as the User with id=userid.

	fn: callback function after message is saved
		fn(err, success)
*/
module.exports.createMessage = function(userid, msg, fn){
	// Create a message data object
	var newMessage = new Message({
		user: userid,
		message: msg, 
		created: Date.now(),
		modified: Date.now()
	});

	// Save the message in the database
	newMessage.save(function(err) {
		if (err) fn(err, false);
		else fn(null, true);
	});	
}

/*	Edits a Message object with the _id=msgId by
	setting message=msg.

	fn: callback function after message is updated
		fn(err,success) 
*/
module.exports.editMessage = function(msgId, msg, fn){
	Message.findOneAndUpdate(
		{_id: msgId}, 
		{message: msg, modified: Date.now()},
		{upsert: true}, 
		function(err, msg){
			if (err) fn(err, false);
			else if (msg) fn(null, true);
			else fn(null, false);

		});
}

/*	Remove a Message object with the _id=msgId

	fn: callback function after message is updated
		fn(err,success) 
*/
module.exports.removeMessage = function(msgId, fn){
	Message.findOneAndRemove(
		{_id: msgId}, 
		function(err, msg){
			if (err) fn(err, false);
			else if (msg) fn(null, true);
			else fn(null, false);
		});
}
