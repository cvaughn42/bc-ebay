INSERT INTO user (user_name, password, first_name, middle_name, last_name, email, street1, city, state, zip_code, phone) VALUES ('cvaughan', 'tiger', 'Chris', null, 'Vaughan', 'christopher.vaughan@ssa.gov', '6401 Security Blvd', 'Baltimore', 'MD', '21235', '(410) 965-2596');
INSERT INTO user (user_name, password, first_name, middle_name, last_name, email, street1, city, state, zip_code, phone) VALUES ('jku', 'tiger', 'Jing', null, 'Ku', 'jing.ku@ssa.gov', '6401 Security Blvd', 'Baltimore', 'MD', '21235', '(410) 555-1212');
INSERT INTO user (user_name, password, first_name, middle_name, last_name, email, street1, city, state, zip_code, phone) VALUES ('fmusubidachi', 'tiger', 'Fabrizio', null, 'Musubidachi', 'fabrizio.musubidachi@ssa.gov', '6401 Security Blvd', 'Baltimore', 'MD', '21235', '(410) 555-1212');
INSERT INTO user (user_name, password, first_name, middle_name, last_name, email, street1, city, state, zip_code, phone) VALUES ('rwang', 'tiger', 'Rong', null, 'Wang', 'rong.wang@ssa.gov', '6401 Security Blvd', 'Baltimore', 'MD', '21235', '(410) 555-1212');

INSERT INTO listing (title, description, user_name, buy_it_now_price, min_bid) VALUES('Little Red Corvette', '1999 Chevrolet Corvette - low miles - a sweet little ride', 'cvaughan', 14999, 1);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('1934 Hot Rod', '1934 Buick Roadster - low miles - rumble seat!', 'cvaughan', 8888);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('Tea Pot - Only a Few Chips', 'Too hot to hold', 'fmusubidachi', 7.20);
INSERT INTO listing (title, description, user_name, buy_it_now_price, min_bid) VALUES('Baseball Bat Parts - Set of Two', 'Transform into most of ash Louisville Slugger', 'rwang', 50.00, 9.99);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('MIBII Poster - Autographed', 'Signed by Morton Frobisher - set design assistant to Assistant Set Designer', 'fmusubidachi', 4.95);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('1971 Spider-man #1', 'From Marble Comics', 'rwang', 1999.99);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('Confederate Cash', '$.14', 'rwang', 10000.00);
INSERT INTO listing (title, description, user_name, buy_it_now_price) VALUES('Walking Liberty Nickel', 'From Fakestackistan', 'jku', 17.95);
INSERT INTO listing (title, description, user_name, sold, buy_it_now_price) VALUES('HP Computers - Gently Used', 'SSA Surplus (1994 vintage)', 1, 'jku', 49123.74);

INSERT INTO listing_keyword (listing_id, keyword) VALUES (1, 'used car');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (2, 'used car');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (1, 'GM');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (2, 'GM');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (1, 'Chevrolet');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (1, 'Corvette');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (4, 'rare');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (4, 'ash');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (5, 'Comics');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (5, 'Geek');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (5, 'Spider-man');
INSERT INTO listing_keyword (listing_id, keyword) VALUES (5, '100% real!');