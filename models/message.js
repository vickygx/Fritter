/* 	Schema to represent the relationship a "tweet"
	that a user can create, edit or delete, as well
	as broadcast to other users.
*/
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var MessagesSchema = new Schema({
	user: {type: String, required: true},
	message_id: {type: Number, required: true},
	message: {type: String, required: true},
	created: {type: Date, required: true},
	modified: {type: Date, required: true}
});

/* 	Gets the time formatted by time from current time. 
	*/
MessagesSchema.methods.getTimeFrom = function() {
    var currentTime = Date.now();
    var seconds = (currentTime - this.modified) / 1000;
    if (seconds < 60){
    	return Math.floor(seconds) + ' seconds ago';
    }
    var min = seconds / 60;
    if (min < 60){
    	return Math.floor(min) + ' mins ago';
    }
    var hour = min / 60;
    if (hour < 24){
    	return Math.floor(hour) + ' hours ago';
    }
    var days = hour / 24;
    return Math.floor(days) + ' days ago';

};
 
module.exports = mongoose.model('message', MessagesSchema);