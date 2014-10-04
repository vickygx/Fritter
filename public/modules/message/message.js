/*	Javascript file taking care of 
	Messages' Viewer 
	This includes creating the modules and setting up the properties
*/
var MessageModule = function(){

	/* 	Function to create individual message widgets*/
	var MessageWidget = function(message, canEdit){
		var message_div = $('<div>').addClass('message');
		message_div.attr('id', message._id);

		// Creating user display
		var message_user = $('<div>')
			.addClass('message_user')
			.addClass('message_type')
			.html('@' + message.user);

		message_div.append(message_user);

		// Creating message display
		var message_message = $('<div>')
			.addClass('message_message')
			.addClass('message_type');

		var textdisplay = $('<span>')
			.addClass('textdisplay')
			.html(message.message);

		var textedit = $('<input>')
			.addClass('textedit')
			.attr('type', 'text')
			.attr('name', 'newmessage');

		message_message.append(textdisplay);
		message_message.append(textedit);
		message_div.append(message_message);

		// Creating time display
		var message_time = $('<div>')
			.addClass('message_time')
			.addClass('message_type')
			.html(getLogicDisplayTime(message.modified));

		message_div.append(message_time);

		if (canEdit){
			// Creating Save button
			var save_button = $('<button>')
				.addClass('saveButton')
				.attr('type', 'submit')
				.html('Save');

			message_div.append(save_button);

			// Creating Edit button
			var edit_button = $('<button>')
				.addClass('editButton')
				.attr('type', 'submit')
				.html('Edit');

			message_div.append(edit_button);

			// Creating Delete button
			var delete_button = $('<button>')
				.addClass('deleteButton')
				.attr('type', 'submit')
				.html('x');

			message_div.append(delete_button);
		}

		return message_div;

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

	/*	Creates editable MessageWidget for all the Message objects in 
		msgs and adds them to the selector  
	*/
	var addEditableMessages = function(msgs, selector){
		for(var i = 0; i < msgs.length; i++){
	        $(selector).append(MessageWidget(msgs[i], true));
	    }
	    setEdit('editButton');
	    setSave('saveButton');
	    setDelete('deleteButton');
	};

	/*	Creates non-editable MessageWidget for all the Message objects in 
		msgs and adds them to the selector  
	*/
	var addDisplayMessages = function(msgs, selector){
		for(var i = 0; i < msgs.length; i++){
	        $(selector).append(MessageWidget(msgs[i], false));
	    }

	};

	// $.post('users/editmessage/' + msgid, )
	// Make submit button of model send post request to edit message

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

			// Show save button
			parent.find('.saveButton')
				.css('display', 'block');

			// Hide own button
			$(this).css('display', 'none');
		});
	};

	/*	Adds functionality of saving messages to all html objects
		with the class <classname> 
	*/
	var setSave = function(classname){
		$('.' + classname).click(function(){
			var parent = $(this).parent();
			var msgId = parent.attr('id');

			// Gets current value in input and hides it 
			var textedit = parent.find('.textedit');
			var newMessage = textedit.val();
			textedit.css('display', 'none');
			
			// TODO: put everything below under success
			$.post('/home/editmessage/' + msgId,
				{ 'newmessage': newMessage});
			
			// Updates textdisplay and shows it
			var textdisplay = parent.find('.textdisplay');
			var currentText = textdisplay.html(newMessage);
			textdisplay.css('display', 'block');
			
			// Show edit button
			parent.find('.editButton')
				.css('display', 'block');

			// Hide save button
			$(this).css('display', 'none');
		});
	};

	/*	Adds functionality of deleting messages to all html objects
		with the class <classname> 
	*/
	var setDelete = function(classname){
		$('.' + classname).click(function(){
			var parent = $(this).parent();
			var msgId = parent.attr('id');

			// TODO: put everything below under success
			$.post('/home/deletemessage/' + msgId);
			
			// Remove from view
			parent.remove();	
		});
	};


	return {
		'addEditableMessages': addEditableMessages,
		'addDisplayMessages': addDisplayMessages
	}

}
