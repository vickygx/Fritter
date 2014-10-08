
/* 	JS files for general practices for all pages
	
	Settings:
	
	1. Linking user text to their user page:
	        Put any dom element with class="g-username" around the username text
		    and it will be linked to user's webpage

*/


// Must be the last function to be called in document.ready()
var setup = function(){
	setUserLinks('g-username');
	setNavBar('#body');
}

var setUserLinks = function(className){
	$("." + className).click(
		function(){
			var username = $(this).html();
			window.location = '/user/' + username;
		});
}

var setNavBar = function(selector){
	var navbar = createNavBar();
	$(selector).append(navbar);
}

var setNavBarToAuth = function(authUser){
	// Hide Log in button
	$('.g-navbar')
		.find('#g-nav-login')
		.css('display', 'none');

	// Add welcome user 
	$('.g-navbar').append($('<div>')
		.addClass('g-nav')
		.addClass('g-nav-log')
		.html('Hi, ' + authUser)

	);
}

var createNavBar = function(){
	var navbar = $('<div>')
		.addClass('g-navbar');

	var logout = $('<form>')
		.addClass('g-nav')
		.addClass('g-nav-log')
		.attr('action', '/logout')
		.attr('method', 'post')
		.append($('<input>')
			.addClass('g-redbutton')
			.attr('type', 'submit')
			.attr('value', 'Sign out'));

	navbar.append(logout);

	var login = $('<form>')
		.addClass('g-nav')
		.addClass('g-nav-log')
		.attr('id', 'g-nav-login')
		.attr('action', '/login')
		.attr('method', 'get')
		.append($('<input>')
			.addClass('g-redbutton')
			.attr('type', 'submit')
			.attr('value', 'Log in'));

	navbar.append(login);

	var dashboard = $('<form>')
		.addClass('g-nav')
		.addClass('g-nav-place')
		.attr('action', '/dashboard')
		.attr('method', 'get')
		.append($('<input>')
			.addClass('g-unbutton')
			.addClass('g-nav-link')
			.attr('type', 'submit')
			.attr('value', 'Dashboard'));

	navbar.append(dashboard);

	var home = $('<form>')
		.addClass('g-nav')
		.addClass('g-nav-place')
		.attr('action', '/home')
		.attr('method', 'get')
		.append($('<input>')
			.addClass('g-unbutton')
			.addClass('g-nav-link')
			.attr('type', 'submit')
			.attr('value', 'Home'));


	navbar.append(home);

	return navbar;

}


