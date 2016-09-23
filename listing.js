var path = require('path');
var db = require('./db.js');

var data = [{id:1, title:'cat'}, {id:2, title:'dog'}];
var count = 2;

// app.get('/listings')
exports.listings = function(req, res) {

    db.findActiveListings(function(err,result) {

        if (err)
        {
            res.send("Unable to find active listings: " + err);
        }
        else
        {
            res.send(result);
        }
    }); 
};

// app.get('/listing/:listing')
exports.listing = function(req, res) {

    db.findListingByListingId(req.params.listingId, function(err, listing) {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.send(listing);
        }
    });
};

// app.post('/search')
exports.search = function(req, res) {
    var srchTerm = req.body.srchTerm;
    var srchResult = [];
    console.log('srchTerm = ' + srchTerm);
    if (srchTerm) {
        data.forEach(function(value){
            if(value.title.toLowerCase().indexOf(srchTerm.toLowerCase()) > -1) {
                srchResult.push(value);
            }
        });
    }
    else {
        srchResult = data;
    }
    console.log('search result = ', srchResult);
    res.send(srchResult);
};

// app.post('/newListing')
exports.newListing = function(req, res) {
    count++;
    data.push({id:count, title:req.body.title});
    res.send(data);
};