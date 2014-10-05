/* 	Schema to represent the relationship a "tweet"
	that a user can create, edit or delete, as well
	as broadcast to other users.
*/
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var TweetsSchema = new Schema({
	owner: {type: String, required: true},
	created: {type: Date, required: true},
	modified: {type: Date, required: true},
	message: {type: String, required: true},
	parent: {type: String, required: false}
});

module.exports = mongoose.model('tweet', TweetsSchema);