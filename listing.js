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

exports.listingImage = function(req, res) {

    db.findListingImage(req.params.listingImageId, function(err, image) {

        if (err)
        {
            console.log(err);
            res.status(500).send(err);
        }
        else
        {
            if (image)
            {
                res.type(image.mime_type);
                res.send(image.image_data);
            }
            else
            {
                console.log('Listing image ' + req.params.listingImageId + ' not found');
                res.status(500).send("Image is null.");
            }
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
        db.findActiveListingsByKeyword(srchTerm, function(err,listing){
            if(err){
                console.log(err);
            }else{
                for(var i in listing){
                    srchResult.push(listing[i]);
                }
                
                //srchResult.push(listing);
                console.log('search result = ', srchResult);
                res.send(srchResult);
            }
        });
    }
    else {
        srchResult = data;
    }  
};

// app.post('/newListing')
exports.newListing = function(req, res) {
    count++;
    data.push({id:count, title:req.body.title});
    res.send(data);
};
