// Imports
var path = require('path');
var db = require('./db.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// import sub modules
var login = require('./login');
var register = require('./register');
var listing = require('./listing');
var profile = require('./profile');
var fileUpload = require('./fileUpload');

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
app.post('/listing', listing.filterOn);
app.post('/newListing', listing.newListing);
app.post('/updateListing', listing.updateListing);
app.get('/listing/:listingId', listing.listing);
app.get('/listingImage/:listingImageId', checkAuth, listing.listingImage);
app.get('listing/removeFilter/:keyword', listing.filterRemove);
app.post('/buyIt', checkAuth, listing.purchaseListing);
app.post('/makeBid', checkAuth, listing.makeBid);
app.get('/bids/:listingId', checkAuth, listing.findValidBids);

// Profile
app.get('/profile/:userName', profile.profile);
app.post('/updateProfile', profile.updateProfile);
app.get('/userImage/:userName', checkAuth, profile.userImage);
app.post('/userImage', checkAuth, upload.single('file'), profile.postUserImage);
app.get('/getSellerInfo/:sellerId', checkAuth, profile.getSellerInfo);

// File Upload
app.post('/upload', upload.single('file'), fileUpload.upload);
 
// Listener
var server = app.listen(port, function () {
    console.log('u*Pay listening on port ' + port + '!');
});


// Fires when node is terminated?
process.on('SIGTERM', function () {
    server.close(function () {
        dao.close();
    });
});
