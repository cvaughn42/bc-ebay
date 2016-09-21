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
    active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_name)
        REFERENCES user (user_name)
);