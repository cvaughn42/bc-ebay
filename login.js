var path = require('path');

// app.post('/login')
exports.login = function (req, res) {
    var user = { 
        userName : 'jku', 
        fistName : 'J1',
        lastName : 'K1'
    };
    console.dir(user);

    console.log("username : " + req.body.userName + " password : " + req.body.password);
    user.userName = req.body.userName;
    user.password = req.body.password;
    
    req.session.currentUser = user;
    
    // TODO Authenticate user here
    res.redirect('/');
};

// app.get('/logout')
exports.logout = function(req, res) {
    delete req.session.currentUser;
    res.redirect('/'); 
};