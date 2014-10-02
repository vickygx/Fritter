/* 	Schema to represent the a user.
	
	Users must each have unique usernames
*/
	
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type: String, required: true, index: { unique: true } },
	password: {type: String, required: true}
});

/* 	Function to validate password 
	Checks to see if candidatePassword is the correct password and stores it in result.
	cb is a callback function which takes in (error, result)
	*/
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    if (candidatePassword === this.password){
    	return cb(null, true);
    }
    return cb(null, false);
};

module.exports = mongoose.model('user', UserSchema);