var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// database setup
var mongo = require('mongodb');
var mongoose = require('mongoose');


var dbURL = 'mongodb://localhost/proj2';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    dbURL = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/fritter';
}
var db = mongoose.connect(dbURL);

// routes setup
var routes = require('./routes/index');
var users_routes = require('./routes/users');

// model setup
var User = require('./models/user');
var Relationships = require('./models/relationship');
var Messages = require('./models/message');

// express setup
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
    app.use(session({ 
        resave: true,
        saveUninitialized: true,
        secret: '$ecRe7',
        store: new MongoStore({
            db : "fritter"
        }) 
    }));
}
else{
    app.use(session({ 
        resave: true,
        saveUninitialized: true,
        secret: '$ecRe7',
        store: new MongoStore({
            db: "fritter",
            username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
            password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
            host: process.env.OPENSHIFT_MONGODB_DB_HOST,
            port: process.env.OPENSHIFT_MONGODB_DB_PORT
        }) 
    }));
}

// Setting up session variables
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});


app.use('/', routes);
app.use('/users', users_routes);

// Setting up 404 
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
