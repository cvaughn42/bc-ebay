var path = require('path');

var profileUser = {userName:'test', firstName:'Test', middleName:'T', lastName:'Test'};

// app.post('/profile')
exports.profile = function(req, res) {
    var userName = req.query.userName;
    console.log('userName = ',userName);

    res.send(profileUser);
};

// app.post('/updateProfile')
exports.updateProfile = function(req, res) {
    var profileUser = req.body.profileUser;
    console.log('profileUser = ',profileUser);

    res.send(profileUser);
};
