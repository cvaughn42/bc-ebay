var path = require('path');

var data = [{id:1, title:'cat'}, {id:2, title:'dog'}];
var count = 2;

// app.get('/listings')
exports.listings = function(req, res) {
    res.send(data);
};

// app.post('/search')
exports.search = function(req, res) {
    var srchTerm = req.body.srchTerm;
    var srchResult = [];
    console.log('srchTerm = ' + srchTerm);
    data.forEach(function(value){
        if(value.title.toLowerCase().indexOf(srchTerm.toLowerCase()) > -1) {
            srchResult.push(value);
        }
    });
    console.log('search result = ', srchResult);
    res.send(srchResult);
};

// app.post('/newListing')
exports.newListing = function(req, res) {
    count++;
    data.push({id:count, title:req.body.title});
    res.send(data);
};