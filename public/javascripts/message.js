function MessageWidget(action, error, isSignup){
	var message = $('<div>').addClass('message');
	var form = $('<form>')
		.attr('action', action)
		.attr('method', 'post')
		.attr('name', 'input');

	// Appending username field
	form.append($('<label>')
			.attr('for', 'username')
			.html('Username'));
	form.append($('<input>')
			.attr('type', 'text')
			.attr('name', 'username')
			.addClass('signupInput'));

	// Appending password field
	form.append($('<label>')
			.attr('for', 'password')
			.html('Password'));
	form.append($('<input>')
			.attr('type', 'text')
			.attr('name', 'password')
			.addClass('signupInput'));

	// Appending error field
	if (error)
		form.append($('<span>').html(error));

	var buttonText = isSignup ? 'sign up' : 'log in';
	// Appending submit button
	form.append($('<input>')
			.attr('type', 'submit')
			.attr('value', buttonText)
			.addClass('signupSubmit'));

	// Appending account text
	if (isSignup){
		form.append($('<div id="accountText">' +
		      		    '<span>Already have an account?</span>' +
		      			'<a href="/login"> Log in here </a>' +
		      		   '</div>'));
	}
	else {
		form.append($('<div id="accountText">' +
		      		    '<span>Don\'t have an account?</span>' +
		      			'<a href="/signup"> Sign up here </a>' +
		      		   '</div>'));
	}
	
	signup.append(form);
	return signup;
};
