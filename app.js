// Imports
var path = require('path');
var db = require('./db.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')

// import sub modules
var login = require('./login');
var register = require('./register');
var listing = require('./listing');
var profile = require('./profile');

// Port constant
const port = 8080;

var app = express();

// Set up resources directory to server static files
app.use(express.static('resources'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'currentUser',
    resave: false,
    saveUninitialized: false
}));

// DB configuration
db.open();
app.set('db', db);


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
app.post('/newListing', listing.newListing);
app.get('/listing', listing.listing);

// Profile
app.get('/profile', profile.profile);
app.post('/updateProfile', profile.updateProfile);

// Listener
var server = app.listen(port, function () {
    console.log('u*Pay listening on port ' + port + '!');
});


// Fires when node is terminated?
process.on('SIGTERM', function () {
    server.close(function () {
        dao.close();
        console.log("Closed out remaining connections.");
    });
});