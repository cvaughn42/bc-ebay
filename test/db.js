
var dbi = require('../db');
var assert = require('assert');

describe('Testing DbInterface', function() {

    // it('can create database when no database exists', function(done) {

    //     dbi.createDatabase(null, function(err) {
    //         done(err);
    //     });
    // });

    it('can create database when database exists', function(done) {

        dbi.createDatabase(null, function(err) {
            done(err);
        });
    });

});