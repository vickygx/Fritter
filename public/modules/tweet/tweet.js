/*	Javascript file taking care of 
	Tweet's Viewer 
	This includes creating the modules and setting up the properties

	Dependents: general.js's user links
*/
var TweetModule = function(){

	/* 	Function to create individual tweet widgets*/
	var TweetWidget = function(tweet, canEdit){
		var tweet_div = $('<div>').addClass('tweet');
		tweet_div.attr('id', tweet._id);

		// Creating user display
		var tweet_user = $('<div>')
			.addClass('tweet_user');

		var owner_div = $('<span>')
			.addClass('user_owner')
			.addClass('user_names')
			.addClass('g-userlink')
			.html('@');

		var owner_username = $('<span>')
			.addClass('g-username')
			.html(tweet.owner);

		owner_div.append(owner_username);

		tweet_user.append(owner_div);

		// If tweet is a retweet
		if (tweet['parent']){
			var parent_div = $('<span>')
				.addClass('user_parent')
				.addClass('user_names')
				.html('<> from ' + tweet['parent']);
			tweet_user.append(parent_div);
		}

		tweet_div.append(tweet_user);

		// Creating message display
		var tweet_message = $('<div>')
			.addClass('tweet_message');

		var textdisplay = $('<span>')
			.addClass('textdisplay')
			.html(tweet.message);

		var textedit = $('<input>')
			.addClass('textedit')
			.attr('type', 'text')
			.attr('name', 'newmessage');

		tweet_message.append(textdisplay);
		tweet_message.append(textedit);
		tweet_div.append(tweet_message);

		// Creating time display
		var tweet_time = $('<div>')
			.addClass('tweet_time')
			.html(getLogicDisplayTime(tweet.modified));

		tweet_div.append(tweet_time);

		if (canEdit){
			// Creating Save button
			var save_button = $('<button>')
				.addClass('saveButton')
				.attr('type', 'submit')
				.html('Save');

			tweet_div.append(save_button);

			// Creating Edit button
			var edit_button = $('<button>')
				.addClass('editButton')
				.attr('type', 'submit')
				.html('Edit');

			tweet_div.append(edit_button);

			// Creating Delete button
			var delete_button = $('<button>')
				.addClass('deleteButton')
				.attr('type', 'submit')
				.html('x');

			tweet_div.append(delete_button);
		}

		return tweet_div;

	};

	/* 	Returns the date in 
		<Day of week> <Month> <Day> <Year> format
	*/
	var getBasicDisplayTime = function(timeString){
		var date = new Date(timeString);
		return date.toDateString();
	};

	/*	Returns the date depending on today's date
		If the date is within same year, but not day:
			<Month> <Day> <Time>
		If the date is not the same year:
			<Month> <Day>, <Year>
	*/
	var getLogicDisplayTime = function(timeString){
		var locale = 'US-en';
		var currentTime = new Date();
		var givenTime = new Date(timeString);
		
		// If in a different year
		if (currentTime.getFullYear() !== givenTime.getFullYear())
			return givenTime.toLocaleString(locale,
				{year: "numeric", month: "short", day: "numeric"});

		// Same year
		return givenTime.toLocaleString(locale, {month: "short", day: "numeric"}) + ' at ' + 
			   givenTime.toLocaleString(locale, {hour: "numeric", minute: "numeric"});

	};

	/* 	Returns the date in 
		<time> <time unit> ago format
	*/
	var getFromDisplayTime = function(timeString){
	    var currentTime = Date.now();
	    var seconds = (currentTime - new Date(timeString)) / 1000;
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

	/*	Creates editable TweetWidget for all the Tweet objects in 
		msgs and adds them to the selector  
	*/
	var addEditableTweets = function(tweets, selector){
		for(var i = 0; i < tweets.length; i++){
	        $(selector).append(TweetWidget(tweets[i], true));
	    }
	    setEdit('editButton');
	    setSave('saveButton');
	    setDelete('deleteButton');
	};

	/*	Creates non-editable TweetWidget for all the Tweet objects in 
		msgs and adds them to the selector  
	*/
	var addDisplayTweets = function(tweets, selector){
		for(var i = 0; i < tweets.length; i++){
	        $(selector).append(TweetWidget(tweets[i], false));
	    }

	};

	/*	Adds functionality of editing tweets to all html objects
		with the class <classname> 
	*/
	var setEdit = function(classname){
		$('.' + classname).click(function(){
			var parent = $(this).parent();

			// Hide current text display
			var textdisplay = parent.find('.textdisplay');
			var currentText = textdisplay.html();
			textdisplay.css('display', 'none');

			// Show editable textbook
			parent.find('.textedit')
				.css('display', 'block')
				.val(currentText);

			// Hide own button
			$(this).css('display', 'none');

			// Show save button
			parent.find('.saveButton')
				.css('display', 'block');

		});
	};

	/*	Adds functionality of saving tweets to all html objects
		with the class <classname> 
	*/
	var setSave = function(classname){
		$('.' + classname).click(function(){
			var saveButton = $(this);
			var parent = saveButton.parent();
			var msgId = parent.attr('id');
			var textedit = parent.find('.textedit');
			var newMessage = textedit.val();

			var successFunction = function(){
				// Hides itextinput
				textedit.css('display', 'none');

				// Updates textdisplay and shows it
				var textdisplay = parent.find('.textdisplay');
				var currentText = textdisplay.html(newMessage);
				textdisplay.css('display', 'block');
				
				// Hide save button
				saveButton.css('display', 'none');

				// Show edit button
				parent.find('.editButton')
					.css('display', 'block');
			}

			// Make a post request to edit tweet
			$.post('/home/edittweet/' + msgId, { 'newmessage': newMessage}, successFunction);		
			
		});
	};

	/*	Adds functionality of deleting tweets to all html objects
		with the class <classname> 
	*/
	var setDelete = function(classname){
		$('.' + classname).click(function(){
			var parent = $(this).parent();
			var msgId = parent.attr('id');

			// Makes a post request to delete
			$.post('/home/deletetweet/' + msgId, 
					function(){
						// Removes tweet if successfully deleted
						parent.remove();	
					});
		});
	};


	return {
		'addEditableTweets': addEditableTweets,
		'addDisplayTweets': addDisplayTweets
	}

}
