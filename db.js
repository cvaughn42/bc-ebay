var fs = require('fs');

/**
 * Database interface class
 */
function DbInterface()
{

}

DbInterface.DB_FILE_NAME = 'upay.sqlite';

/**
 * Create the database
 * @param dbFileName name of the datbase file to create
 * @param callback (err)
 */
DbInterface.prototype.createDatabase = function(dbFileName, callback) {

    if (!dbFileName)
    {
        dbFileName = DbInterface.DB_FILE_NAME;
    }

    new Promise((resolve, reject) => {

	    fs.exists(dbFileName, function(exists) {

            if (exists)
            {
                return new Promise((resolve, reject) => {
                    // Delete file here
                    fs.unlync(dbFileName, function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            else
            {
                resolve();
            }
        });
    }).then(function() {

        return new Promise((resolve, reject) => {
            fs.readFile('create_tables.sql', 'utf8', (err, data) => {
                if (err) reject(err)
                else resolve(data);
            });
        });
    }).then(function(data) {

        var sqlite3 = require("sqlite3").verbose();
        var db = new sqlite3.Database(dbFileName);

        db.exec(data, function(err) {

            if (err)
            {
                callback("Unable to create database: " + err);
            }
            else
            {
                callback(null);
            }
        });

    }).catch(function(err) {

        callback("Unable to create database: " + err);
    });
};

module.exports = new DbInterface();