function MessageWidget(action, error, isSignup){
	var message = $('<div>').addClass('message');
};


// $.post('users/editmessage/' + msgid, )
// Make submit button of model send post request to edit message

function setEdit(classname){
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
}

function setSave(classname){
	$('.' + classname).click(function(){
		var parent = $(this).parent();
		var msgId = parent.attr('id');

		// Gets current value in input and hides it 
		var textedit = parent.find('.textedit');
		var newMessage = textedit.val();
		textedit.css('display', 'none');
		
		// TODO: put everything below under success
		$.post('editmessage/' + msgId,
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
}

function setDelete(classname){
	$('.' + classname).click(function(){
		var parent = $(this).parent();
		var msgId = parent.attr('id');

		// TODO: put everything below under success
		$.post('deletemessage/' + msgId);
		
		// Remove from view
		parent.remove();	
	});
}



