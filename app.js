// Imports
var express = require('express');
var app = express();

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var session = require('express-session')
app.use(session({
    secret: 'currentUser',
    resave: false,
    saveUninitialized: false
}));

// Set up resources directory to server static files
app.use(express.static('resources'));


// Port constant
const port = 8080;


// import sub modules
var login = require('./login');
var register = require('./register');
var listing = require('./listing');


var checkAuth = function(req, res, next) {
    if (!req.session.currentUser) {
        res.sendFile(path.join(__dirname + '/login.html'));
    } else {
        next();
    }
};

// General
app.get('/', checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Login
app.post('/login', login.login);
app.get('/logout', checkAuth, login.logout);

// Register
app.get('/register', register.display);
app.post('/register', register.registerUser);

app.get('/currentUser', checkAuth, function(req, res) {
    res.send(req.session.currentUser);
});

// Listings
app.get('/listings', listing.listings);
app.post('/search', listing.search);


// Listener
var server = app.listen(port, function () {
    console.log('u*Pay listening on port ' + port + '!');
});
