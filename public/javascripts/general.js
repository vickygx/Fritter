
/* 	JS files for general practices for all pages
	
	Settings:
	
	1. Linking user text to their user page:
	        Put any dom element with class="g-username" around the username text
		    and it will be linked to user's webpage

	2. Adding navigation bar
			body must have id=body
			the rest of the content should be in a div with class=g-content

*/


/* 	Setup function
		- Links user texts --> user pages
		- Sets navigation bar

	Must be the last function to be called in document.ready()
*/
var setup = function(){
	setUserLinks('g-username');
	setNavBar('#body');
}

/*	Function to set user links 
*/
var setUserLinks = function(className){
	$("." + className).click(
		function(){
			var username = $(this).html();
			window.location = '/user/' + username;
		});
}

/*	Function to set navigation bar 
*/
var setNavBar = function(selector){
	var navbar = createNavBar();
	$(selector).append(navbar);
}

/*	Function to change the navigation bar to display
	an authenticated user's name 
*/
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

/*	Function to create a navigation bar 
*/
var createNavBar = function(){
	var navbar = $('<div>')
		.addClass('g-navbar');

	// Adding logout button
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

	// Adding login button
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

	// Adding home nav
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

	// Adding dashboard nav
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

	// Adding followed dashboard nav
	var followed = $('<form>')
		.addClass('g-nav')
		.addClass('g-nav-place')
		.attr('action', '/dashboard/followed')
		.attr('method', 'get')
		.append($('<input>')
			.addClass('g-unbutton')
			.addClass('g-nav-link')
			.attr('type', 'submit')
			.attr('value', 'Followed'));

	navbar.append(followed);


	return navbar;

}
