// Import Express library
var express = require('express');
var app = express();

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

// Import path library
var path = require('path');

// Port constant
var port = 8080;

function checkAuth(req, res, next) {
    if (!req.session.currentUser) {
        readFile('login.html', 'utf8').then(function (html) {
            res.send(html);
        });
    } else {
        next();
    }
}

app.get('/', checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    
}).get('/logout', checkAuth, function(req, res) {

    delete req.session.currentUser;
    res.redirect('/'); 

}).get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));

}).post('/login', function (req, res) {

    // TODO Authenticate user here
    res.redirect('/');
}).post('/register', function (req, res) {

    // TODO Create new user here
    res.redirect('/');
});

var server = app.listen(port, function () {
    console.log('u*Pay listening on port ' + port + '!');
});