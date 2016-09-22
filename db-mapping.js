module.exports = {

    userToDatabaseMapping: {
        userName: "user_name",
        password: "password",
        firstName: "first_name",
        middleName: "middle_name",
        lastName: "last_name",
        "address.street1": "street1",
        "address.street2": "street2",
        "address.city": "city",
        "address.state": "state",
        "address.zipCode": "zip_code",
        phone: "phone",
        email: "email"
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
        email: "email"
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
        }
    }

};