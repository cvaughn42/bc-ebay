var fs = require('fs');

/**
 * Database interface class
 */
function DbInterface()
{

}

DbInterface.DB_FILE_NAME = 'upay.sqlite';
/* USER TABLE SQL */
DbInterface.CREATE_USER_SQL = `INSERT INTO user
                               (user_name, password, first_name, middle_name, last_name, email, street1, street2, city, state, zip_code, phone) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
DbInterface.UPDATE_USER_SQL = `UPDATE user 
                               SET first_name = ?,
                                   middle_name = ?,
                                   last_name = ?,
                                   email = ?,
                                   street1 = ?,
                                   street2 = ?,
                                   city = ?,
                                   state = ?,
                                   zip_code = ?,
                                   phone = ? 
                               WHERE user_name = ?`;
DbInterface.SELECT_USER_SQL = `SELECT user_name, first_name, middle_name, last_name, email, street1, street2, city, state, zip_code, phone 
                               FROM user `;
DbInterface.AUTHENTICATE_USER_SQL = DbInterface.SELECT_USER_SQL + 
                                    `WHERE user_name = ? AND password = ?`;

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

/**
 * Create a new user
 * @param user User object
 * @param callback (err, userId)
 */
DbInterface.prototype.createUser = function(user, callback) {

};

/**
 * Update a user
 * @param user User with new values
 * @param callback (err, numRows (1 or 0))
 */
DbInterface.prototype.updateUser = function(user, callback) {

};

/**
 * Authenticate a user
 * @param credentials { userName: <value>, password: <value> }
 * @param callback (err, user)
 */
DbInterface.prototype.authenticateUser = function(credentials, callback) {

};

module.exports = new DbInterface();