/*
 * USER Table
 */
CREATE TABLE IF NOT EXISTS user
(
    user_name VARCHAR(20) NOT NULL PRIMARY KEY,
    password VARCHAR(20) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    middle_name VARCHAR(20),
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    street1 VARCHAR(255) NOT NULL,
    street2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    phone VARCHAR(14) NOT NULL
);

/*
 * USER IMAGE Table
 */
CREATE TABLE IF NOT EXISTS user_image
(
    user_image_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20) NOT NULL,
    image_data BLOB NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_name)
        REFERENCES user (user_name)
);

/*
 * LISTING Table
 */
CREATE TABLE IF NOT EXISTS listing
(
    listing_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20) NOT NULL,
    title VARCHAR(40) NOT NULL,
    description TEXT,
    buy_it_now_price NUMERIC,
    min_bid NUMERIC,
    start_date TIMESTAMP NOT NULL DEFAULT (datetime('now', 'localtime')),
    end_date TIMESTAMP NOT NULL DEFAULT (datetime('now', '7 days', 'localtime')),
    sold INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_name)
        REFERENCES user (user_name)
);

/*
 * LISTING KEYWORD Table
 */
CREATE TABLE IF NOT EXISTS listing_keyword
(
    listing_id INTEGER NOT NULL,
    keyword VARCHAR(20) NOT NULL,
    FOREIGN KEY (listing_id)
        REFERENCES listing (listing_id)
);

/*
 * LISTING KEYWORD INDEX
 * Should be optimized for quick retrieval of listings by keyword
 */
CREATE UNIQUE INDEX IF NOT EXISTS listing_keyword_idx
ON listing_keyword (keyword, listing_id);

/*
 * LISTING IMAGE Table
 */
CREATE TABLE IF NOT EXISTS listing_image
(
    listing_image_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    image_data BLOB NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id)
        REFERENCES listing (listing_id)
);