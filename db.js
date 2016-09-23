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
/* LISTING TABLE SQL */
DbInterface.CREATE_LISTING_SQL = `INSERT INTO listing 
                                  (title, description, user_name, buy_it_now_price, min_bid, start_date, end_date, sold) 
                                  VALUES ($title, $description, $userName, $buyItNowPrice, $minBid, $startDate, $endDate, $sold)`;
DbInterface.SELECT_LISTING_SQL = `SELECT listing_id, title, description, buy_it_now_price, min_bid, start_date, 
                                         end_date, sold, u.user_name, u.first_name, u.middle_name, u.last_name, 
                                         (SELECT group_concat(keyword) FROM listing_keyword WHERE listing_id = l.listing_id) AS keywords,
                                         (SELECT group_concat(listing_image_id) FROM listing_image WHERE listing_id = l.listing_id) AS image_ids
                                  FROM listing AS l
                                  INNER JOIN user AS u ON l.user_name = u.user_name `;
DbInterface.FIND_LISTING_BY_LISTING_ID_SQL = DbInterface.SELECT_LISTING_SQL + 
                                             `WHERE l.listing_id = ?`;
DbInterface.FIND_ACTIVE_LISTINGS_SQL = DbInterface.SELECT_LISTING_SQL +
                                       `WHERE sold = 0 AND 
                                              start_date <= current_timestamp AND 
                                              end_date >= current_timestamp`;
DbInterface.FIND_ACTIVE_LISTINGS_BY_KEYWORD_SQL = DbInterface.SELECT_LISTING_SQL +
                                                  `WHERE sold = 0 AND 
                                                         start_date <= current_timestamp AND 
                                                         end_date >= current_timestamp AND
                                                         listing_id IN (SELECT listing_id 
                                                                        FROM listing_keyword 
                                                                        WHERE keyword IN ?)`;
DbInterface.CREATE_LISTING_IMAGE_PS = "INSERT INTO listing_image (listing_id, image_data, mime_type) VALUES ($listingId, $imageData, $mimeType)";
                    
/* LISTING KEYWORD TABLE SQL */
DbInterface.CREATE_LISTING_KEYWORD_SQL = `INSERT INTO listing_keyword (listing_id, keyword) VALUES (?, ?)`;

/* USER TABLE SQL */
DbInterface.CREATE_USER_SQL = `INSERT INTO user
                               (user_name, password, first_name, middle_name, last_name, email, street1, street2, city, state, zip_code, phone) 
                               VALUES ($userName, $password, $firstName, $middleName, $lastName, $email, $street1, $street2, $city, $state, $zipCode, $phone)`;
DbInterface.UPDATE_USER_SQL = `UPDATE user 
                               SET first_name = $firstName,
                                   middle_name = $middleName,
                                   last_name = $lastName,
                                   email = $email,
                                   street1 = $street1,
                                   street2 = $street2,
                                   city = $city,
                                   state = $state,
                                   zip_code = $zipCode,
                                   phone = $phone 
                               WHERE user_name = $userName`;
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

        var data = fs.readFileSync('create_tables.sql', 'utf8');
        
        self.db.serialize(function() {
            self.db.exec(data, function(err) {

                if (err)
                {
                    console.log("Unable to update database: " + err);
                }
            });
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
 * Create a new listing
 * @param listing
 * @callback (err, listingId)
 */
DbInterface.prototype.createListing = function(listing, callback) {

    var params = objectMapper(listing, mappings.listingToDatabaseMapping);

    this.db.run(DbInterface.CREATE_LISTING_SQL, params, function(err) {

        if (err)
        {
            callback("Unable to create listing: " + err);
        }
        else
        {
            callback(null, this.lastID);
        }
    });
};

/**
 * Find all active listings
 * @param callback (err, listings)
 */
DbInterface.prototype.findActiveListings = function(callback) {

    this.db.all(DbInterface.FIND_ACTIVE_LISTINGS_SQL, function(err, rows) {

        if (err)
        {
            callback("Unable to find active listings: " + err);
        }
        else
        {
            var listings = [];

            for (var row of rows)
            {
                listings.push(objectMapper(row, mappings.listingToBusinessMapping));
            }

            callback(null, listings);
        }
    });
};

/**
 * Find the specific listing
 * @param listingId
 * @param callback (err, listing)
 */
DbInterface.prototype.findListingByListingId = function(listingId, callback) {

    this.db.get(DbInterface.FIND_LISTING_BY_LISTING_ID_SQL, listingId, function(err, row) {
        if (err)
        {
            callback("Unable to find listing with ID " + listingId + ": " + err);
        }
        else
        {
            callback(null, objectMapper(row, mappings.listingToBusinessMapping));
        }
    });
};

/**
 * Find all active listings with the specified keywords
 * @param keywords Array
 * @param callback (err, listings)
 */
DbInterface.prototype.findActiveListingsByKeyword = function(keywords, callback) {

    this.db.all(DbInterface.FIND_ACTIVE_LISTINGS_BY_KEYWORD_SQL, keywords, function(err, rows) {

        if (err)
        {
            callback("Unable to find active listings for keywords: " + keywords + ": " + err);
        }
        else
        {
            var listings = [];

            for (var row of rows)
            {
                listings.push(objectMapper(row, mappings.listingToBusinessMapping));
            }

            return listings;
        }
    });
};

/**
 * Add keywords to the listing
 * @param listingId 
 * @param keywords Array
 * @param callback (err, count (# of keywords added))
 */
DbInterface.prototype.addListingKeywords = function(listingId, keywords, callback) {
    
    if (keywords && keywords.length)
    {
        var self = this;

        // TODO Put this into a transaction
        this.db.serialize(function() {

            var stmt = self.db.prepare(DbInterface.CREATE_LISTING_KEYWORD_SQL);
            var cnt = 0;

            for (var keyword of keywords)
            {
                stmt.run(listingId, keyword, function(err) {
                    if (err) 
                    {
                        callback("There was an error inserting keyword \"" + keyword + "\": " + err, cnt);
                        return;
                    }
                    else
                    {
                        cnt++;
                    }
                });
            }

            stmt.finalize();

            callback(null, cnt);
        });
    }
    else
    {
        callback(null, 0);
    }
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
        
        stmt.run(objectMapper(user, mappings.userToDatabaseMapping), function(err) {
                
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
    
    var self = this;

    this.db.serialize(function() {
        
        var stmt = self.db.prepare(DbInterface.UPDATE_USER_SQL);

        stmt.run(objectMapper(user, mappings.userToDatabaseMapping), function(err) {

            if (err)
            {
                callback("Unable to update user: " + err, 0);
            }
            else
            {
                if (this.changes == 1)
                {
                    callback(null, 1);
                }
                else
                {
                    callback("There was an error updating the user: expected 1 modified row, but found " + this.changes, this.changes);
                }
            }
        });


    });

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


/**
 * Create a new listing image
 * @param imageFile
 * @param callback (err, count (0 or 1))
 */
DbInterface.prototype.createListingImage = function(imageFile, callback) {

    var self = this;

    this.db.serialize(function() {
        var stmt = self.db.prepare(DbInterface.CREATE_LISTING_IMAGE_PS);
        
        var params = {
            $listingId: imageFile.listingId,
            $imageData: imageFile.imageData,
            $mimeType: imageFile.mimeType
        };

        stmt.run(params, function(err) {
            if (err)
            {
                callback("Unable to save listing image: " + err);
            }
            else
            {
                callback(null, this.changes);
            }
        });
        stmt.finalize();
    });
};


module.exports = new DbInterface();
