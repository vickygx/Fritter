/* 	Schema to represent the relationship between two users.
	It contains followee and follower pair, which contains the username
	of the users in the user schema.
	
	There can be multiple rows where followee and follower
	is the same user.
	*/
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var RelationshipSchema = new Schema({
	followee: {type: String, required: true},
	follower: {type: String, required: true}
});
 
module.exports = mongoose.model('relationship', RelationshipSchema);