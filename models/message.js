/* 	Schema to represent the relationship a "tweet"
	that a user can create, edit or delete, as well
	as broadcast to other users.
*/
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var MessagesSchema = new Schema({
	user: {type: String, required: true},
	message: {type: String, required: true},
	created: {type: Date, required: true},
	modified: {type: Date, required: true}
});

module.exports = mongoose.model('message', MessagesSchema);