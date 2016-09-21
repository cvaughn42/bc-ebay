var path = require('path');

// app.get('/register')
exports.display = function (req, res) {
    console.dir(path.join(__dirname));
    res.sendFile(path.join(__dirname + '/register.html'));
};


// app.post('/register')
exports.registerUser = function (req, res) {
    // TODO Create new user here
    res.redirect('/');
};