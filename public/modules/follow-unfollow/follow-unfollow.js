/*	Javascript file taking care of 
	Follow functionalities
	This includes creating the modules and setting up the properties
*/
var FollowUnfollowModule = function(){

	var FOLLOW_TYPE = 'FOLLOW';
	var UNFOLLOW_TYPE = 'UNFOLLOW';

	/* 	Function to create individual follow widgets*/
	var FollowUnfollowWidget = function(type){
		var followbutton = $("<button>")
			.addClass('FollowButton')
			.addClass(type)
			.addClass('g-redbutton')
			.html(type);

		return followbutton;
	};

	var setFollowUnfollow = function(classname, followee){
		$('.' + classname).click(function(){
			var button = $(this);
			var type = button.html();
			var postType = '/';
			var nextType = null;
			
			// Figure out proper post request type depending on current status
			if (type === FOLLOW_TYPE){
				postType = '/user/follow';
				nextType = UNFOLLOW_TYPE;
			}
			else {
				postType = '/user/unfollow';
				nextType = FOLLOW_TYPE;
			}

			// successfunction should change html to opposite
			var successFunction = function(){
				button.removeClass(type)
					.addClass(nextType)
					.html(nextType);	
			}

			// send post request
			$.post(postType, {'followee': followee}, successFunction)
			
		});
	};

	var addFollowButton = function(selector, followee){
		$(selector).append(FollowUnfollowWidget(FOLLOW_TYPE));
		setFollowUnfollow('FollowButton', followee);

	};

	var addUnfollowButton = function(selector, followee){
		$(selector).append(FollowUnfollowWidget(UNFOLLOW_TYPE));
		setFollowUnfollow('FollowButton', followee);
	};

	return {
		'addFollowButton': addFollowButton,
		'addUnfollowButton': addUnfollowButton
	}

}
