module.exports = {

    userToDatabaseMapping: {
        userName: "$userName",
        password: "$password",
        firstName: "$firstName",
        middleName: "$middleName",
        lastName: "$lastName",
        "address.street1": "$street1",
        "address.street2": "$street2",
        "address.city": "$city",
        "address.state": "$state",
        "address.zipCode": "$zipCode",
        phone: "$phone",
        email: "$email"
    },

    userToBusinessMapping: {
        user_name: "userName",
        password: "password",
        first_name: "firstName",
        middle_name: "middleName",
        last_name: "lastName",
        street1: "address.street1",
        street2: "address.street2",
        city: "address.city",
        state: "address.state",
        zip_code: "address.zipCode",
        phone: "phone",
        email: "email",
        user_image_id: "userImageId"
    },

    /* NOTE: Had to add start and end date transforms because 
     * database defaults were failing when params were undefined 
     * or null 
     */
    listingToDatabaseMapping: {
        listingId: '$listingId',
        title: '$title',
        description: '$description',
        buyItNowPrice: '$buyItNowPrice',
        minBid: '$minBid',
        startDate: {
            key: '$startDate',
            transform: function(val) {
                if (!val)
                {
                    return new Date();
                }
                else
                {
                    return val;
                }
            }
        },
        endDate: {
            key: '$endDate',
            transform: function(val) {
                if (!val)
                {
                    return new Date();
                }
                else
                {
                    return val;
                }
            }
        },
        sold: {
            key: '$sold',
            transform: function(val) {
                if (val) return 1;
                else return 0;
            }
        },
        "user.userName": '$userName'
    },

    listingToBusinessMapping: {
        listing_id: 'listingId', 
        title: 'title', 
        description: 'description', 
        buy_it_now_price: 'buyItNowPrice', 
        min_bid: 'minBid', 
        start_date: {
            key: 'startDate',
            transform: function(val) {
                return val ? new Date(val) : null;
            }
        },
        end_date: {
            key: 'endDate',
            transform: function(val) {
                return val ? new Date(val) : null;
            }    
        }, 
        sold: {
            key: 'sold',
            transform: function(val) {
                return val === 1;
            }
        }, 
        user_name: 'user.userName', 
        first_name: 'user.firstName', 
        middle_name: 'user.middleName', 
        last_name: 'user.lastName',
        user_image_id: 'user.userImageId',
        keywords: {
            key: "keywords",
            transform: function(val) {
                if (val)
                {
                    return val.split(',');
                }
                else
                {
                    return [];
                }
            }
        }, image_ids: {
            key: "imageIds",
            transform: function(val) {
                if (val)
                {
                    return val.split(',');
                }
                else
                {
                    return [];
                }
            }
        }
    }

};
