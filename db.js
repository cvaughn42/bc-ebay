var fs = require('fs');
var mappings = require('./db-mapping');
var objectMapper = require('object-mapper');
var sqlite3 = require("sqlite3");

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
 * Open the database
 */
DbInterface.prototype.open = function(dbFileName, update) {

    if (this.db)
    {
        throw "Database is already open";
    }

    if (!dbFileName)
    {
        dbFileName = DbInterface.DB_FILE_NAME;
    }

    this.db = new sqlite3.Database(dbFileName);

    if (update)
    {
        var self = this;

        fs.readFileSync('create_tables.sql', 'utf8', function(err, data) {
            if (err)
            {
                console.log("Unable to update database: unable to read 'create_tables.sql': " + err);
            }
            else 
            {
                self.db.exec(data, function(err) {

                    if (err)
                    {
                        console.log("Unable to update database: " + err);
                    }
                });
            }
        });
    }
};

/**
 * Close the database
 */
DbInterface.prototype.close = function() {
    if (!this.db)
    {
        throw "No database is open";
    }

    this.db.close(function(err) {
        if (err)
        {
            console.log("Unable to close database: " + err);
        }
        else
        {
            delete this.db;
        }
    });
};

/**
 * Create a new user
 * @param user User object
 * @param callback (err, count (0 or 1))
 */
DbInterface.prototype.createUser = function(user, callback) {

    var self = this;

    this.db.serialize(function() {
        var stmt = self.db.prepare(DbInterface.CREATE_USER_SQL);
        
        stmt.run(user.userName, user.password, user.firstName, user.middleName, user.lastName, user.email, user.address.street1, 
                 user.address.street2, user.address.city, user.address.state, user.address.zipCode, user.phone, function(err) {
                
                if (err)
                {
                    callback("Unable to create user: " + err);
                }
                else
                {
                    callback(null, this.changes);
                }
        });

        stmt.finalize();
    });

};

/**
 * Update a user
 * @param user User with new values
 * @param callback (err, numRows (1 or 0))
 */
DbInterface.prototype.updateUser = function(user, callback) {

    throw 'Not implemented';
};

/**
 * Authenticate a user
 * @param credentials { userName: <value>, password: <value> }
 * @param callback (err, user)
 */
DbInterface.prototype.authenticateUser = function(credentials, callback) {

    this.db.get(DbInterface.AUTHENTICATE_USER_SQL, credentials.userName, credentials.password, function(err, row) {

        if (err)
        {
            callback('Unable to authenticate User: ' + err, null);
        }
        else 
        {
            if (row == null)
            {
                callback('Invalid user name or password', null);
            }
            else
            {
                callback(null, objectMapper(row, mappings.userToBusinessMapping));
            }
        }
    });
};

module.exports = new DbInterface();