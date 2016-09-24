var path = require('path');
var db = require('./db.js');

var profileUser = {userName:'test', firstName:'Test', middleName:'T', lastName:'Test'};

// app.post('/profile')
exports.profile = function(req, res) {
    var userName = req.param.userName;

    db.findUserByUsername(req.params.userName, function(err, profile) {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.send(profile);
        }
    });

};

exports.userImage = function(req, res) {

    db.findUserImage(req.params.userName, function(err, image) {

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
                console.log('User image is null for user name ' + req.params.userName);
                res.status(500).send("Image is null.");
            }
        }
    });
    
};

// app.post('/updateProfile')
exports.updateProfile = function(req, res) {
    var profileUser = req.body.profileUser;
    console.log('profileUser = ',profileUser);
    var phone = profileUser.phone.replace(/[^0-9]/g, '');
    console.log('phone = ',phone);
    profileUser.phone = '(' + phone.substring(0,3) + ') ' + phone.substring(3,6) + '-' + phone.substring(6);
    console.log('phone = ',profileUser.phone);

    db.updateUser(profileUser, function(err, result) {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.send(result);
        }
    });

    res.send(profileUser);
};
