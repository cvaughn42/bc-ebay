var path = require('path');

// app.get('/listings')
exports.listings = function(req, res) {
    res.send([{id:1, title:'cat'}, {id:2, title:'dog'}]);
};

// app.post('/search')
exports.search = function(req, res) {
    res.send([{id:2, title:'dog'}]);
};