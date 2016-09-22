
var dbi = require('../db');
var assert = require('assert');

describe('Testing DbInterface', function() {

    before(function() {
        dbi.open(null, true);
    });

    after(function() {
        dbi.close();
    });

    // it('can create test user', function(done) {

    //     dbi.createUser({
    //         userName: 'Test' + (new Date()).getTime(),
    //         password: 'tiger',
    //         firstName: "Test",
    //         lastName: 'User',
    //         address: {
    //             street1: '100 Main St',
    //             city: 'Baltimore',
    //             state: 'MD',
    //             zipCode: '21201'
    //         },
    //         phone: '(410) 555-1212',
    //         email: 'TestUser@ssa.gov'
    //     }, function(err, cnt) {
    //         if (err)
    //         {
    //             done(err);
    //         }
    //         else
    //         {
    //             if (cnt !== 1)
    //             {
    //                 done(new Error('Received %s count: expected 1', cnt));
    //             }
    //             else
    //             {
    //                 done();
    //             }
    //         }
    //     });
    // });

    it('can get active listings', function(done) {

        dbi.findActiveListings(function(err, listings) {
            if (err)
            {
                done(err);
            }
            else
            {
                console.dir(listings);
                done();
            }
        });
    });

    // it('can authenticate', function(done) {

    //     dbi.authenticateUser({userName: 'Test1474488306598', password: 'tiger'}, function(err, user) {

    //         if (err) done(err);
    //         else {
    //             console.dir(user);
    //             done();
    //         }

    //     });
    // });

});