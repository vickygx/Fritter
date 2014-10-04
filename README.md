Fritter
=====
author: vickyg@mit.edu

A. Design
=============

I. Purpose

This project is a clone of the twitter and aims to provide a space where users can:
	- login / signup
	- post, edit and delete tweets
	- view own tweets
	- view tweets of others
	- see other users

The application is a Express Application built on MongoDB as its database. 


II. Approach

The design of this project revolves around a MVC based approach. The models are Moongoose schema models, the viewer is rendered through EJS and HTML, and the controller on Express/NodeJS.

The models provide the structure for the data.
The viewers render each page.
And the controller retrieves and functionalizes the data for the viewer to use. 
For more information on the file structure, look below.


III. Data Model

The data model of this application revolves around three simple but important models:
	User: Only contains information needed on the minimal account
		- username (unique)
		- password
	Messages: Holds all the 'tweets' ever created on the website
		- user ( which is the unique username, and needed to figure out who created the message )
		- message ( the content of each tweet )
		- created ( time it was created, so we sort by creation )
		- modified (time it was modified, so we can sort by modified date)
	Relationships: (Not used for part i)
		- followee (username of followee)
		- follower (username of follower)

Considerations:
	1) Mongoose vs. Monk

	Many argue that one of the many benefits of MongoDB is that it is schemaless. However, any good design also must have some data model, which is a less formalized version of a schema. Moreover, this project will soon contain many complicated relationships (relationships between users and message, users and other users) and features. Thus, I have decided to use Mongoose instead of Monk so that I can go through an object oriented approach in building my model. I also felt that using Mongoose allowed an easier way for me to modularize my code (MVC).

	2) Messages - Relational vs. embedded 

	I first weighed several options:
	a) Having one large document: User contains username, password, a list of messages
	b) Having several tables: User contains username, password. Message contains username, message information.

	I opted for b) because while a) would provide fast retrieval of information for a specific user (i.e. showing each user their own mesages), it was not ideal for displaying tweets of all users, searching through tweets for some common feature, sorting tweets by date or even editing messages. Instead, such actions would require the retrieval/sort/search to go through another level in each object (user --> message_list --> message). For example, for a) editing messages would require fetching a user and then fetching a message. However, for b) editing messages would only require fetching the message object.

	Meanwhile, we can still search through all the messages with a given username pretty fast since the username is a top-level attribute of messages.

	Benefit: 
		- Implementation of needed features was very simple
		- Fast access
		- Clear concept


	3) Relationships Schema (Will talk about in part ii)


IV. Additional Challenges & Design Choices
	1) Designing the edit/delete mechanism for messages

	Figuring out the best way to edit/delete messages was a bit difficult. However, because I can easily access all messages through simply passing in the ID, I chose to store the model.ID as the div.ID of each div that contained the message. Although this was not as secure, it provided an easy way for handlers to make a proper post request. Any button can just get the ID of the parent div and use that as the paramters for a post.

	I did think about implementing a hashing function so that the mongodb created ID was not revealed in the HTML.

	2) Designing the user-facing edit/delete mechanism
	There were two considerations I had: popping up a modal to change the message or using javascript to turn the text into an input box. I chose the latter because I felt it was easier for the user to make changes, and editing posts might be a more frequent habit.

	4) Time view
	For each message, I have a time display. 

V. Design Benefits
	1) Simple and concise semi-relational schema 
	- Look to explanation above

	2) Server-side timestamping and time storage
	- Everytime a message is created, a Date.now() object is created so that each message is timestamped right before it gets saved in the database. This makes the time more accurate, especially if there would be delay between client and server.
	- Storing Date objects allow us to transfer the later json encodded string back to a date and thus display date's in different versions. I.e. I can show year, month and/or day by some logic (as I do) instead of just displaying a String that was saved right at message creation.

	3) Modules
	- This is more of a design benefit for the code, but by creating modules for messages and login/signup, I can 
	1) modify the look and functionality very easily by replacing just the module files
	2) Make many copies of either messages or login/signup boxes so that I can put them on different routes/pages.

	Note: I decided to put them in a separate module folder under public instead of putting it into css and javascript because it is easier to understand and see the difference between page css/javascript and css/javascript related only to specific parts of the page (i.e. modules).

	4) View separation into dashboard, home and user instead of user and index.

	I made the views separate into dashboard, home and user because I felt that the dashboard could be a feature that contains many other features. For example, your dashboard (which shows other users and tweets) can only show you various modified dashboards by extending that view.
		dashboard/followed -- show a dashboard of tweets form people you follow
		dashboard/<interest> -- show a dashboard of tweets based on an interest
	I also made home by itself because ths would take care of all user-specific related pages. For the future, this could be
		home/account
		home/my-tweets
		home/my-followers
	Index takes care of all the required views for getting setup with the site (landing, logging in, and signup).

	Thus, the view separation has been built and structured by keeping future possible features in mind and grouping them together.


B. File Structure
=================

app.js: The main server to be run. Contains all setup
controllers/: Contains the controllers for each model.
			  (Connector between model and view)
	messages.js: Controller for Message Model
		- Takes care of creation, modification and removal of messages
	users.js: Controller for User model
		- Takes care of creation, login, logout, authentication and sessions of users.
models/: Contains the models 
	message.js: Message model
	user.js: User model
	relationship.js: Relationship model (TBU in part 2)
views/: Contains all the views
	dashboard/: All the files related to dashboard view
	home/: All the files related to home page view
	index/: All the files related to landing and logging in
routes/:
	dashboard.js: routes for /dashboard
	home.js: routes for /home
	index.js: routes for /
public/:
	images/: contains all images used
	javascripts/: contains all javascript used in pages
	modules/: contains modules
	stylesheets/: conains all css used in pages
public/modules:
	message/: contains js & css related to module that renders
		the individual messages.
	signup-login/: contains js & css related to module that renders
		both signup and login box.

C. Viewing
=============
http://fritter-vickyg.rhcloud.com/