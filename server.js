/*
 *  Creating the server.js file for the project
 */
var express = require('express');
// For enabling parsing of request body by node.
var bodyParser = require('body-parser');
// Configure the server to use cookie based session support
var cookieParser = require('cookie-parser');
// For session management
var session = require('express-session');
// For authentication using passport JS
var passport = require('passport');

var app = express();

// Configuring Settings for the Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuring the app to use cookie parser
app.use(cookieParser());

// Configuring session settings
app.use(session({
    // Need to later replace with the environment variables -> process.env.SECRET_SESSSION
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Configuring passport and initializing it
app.use(passport.initialize());
// Configuring session in passport and initializing it
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// Server Related Changes for Project
var project = require("./project/app.js");
project(app);

// Getting the port 
var port = process.env.PORT || 3000;

app.listen(port);
