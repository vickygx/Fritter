
/* 	JS files for general practices for all pages
	
	Settings:
	
	1. Linking user text to their user page:
	        Put any dom element with class="g-username" around the username text
		    and it will be linked to user's webpage

*/


// Must be the last function to be called in document.ready()
var setup = function(){
	setUserLinks('g-username');
}

var setUserLinks = function(className){
	$("." + className).click(
		function(){
			var username = $(this).html();
			window.location = '/user/' + username;
		});
}


