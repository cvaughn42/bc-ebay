app.config(function ($routeProvider) {
    $routeProvider.when("/purchase/:listingId", {
        templateUrl: "templates/purchase.html",
        controller: "purchaseController",
        link: function($scope, element, attrs) {

        }
    });
});

app.directive('address', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'        
        },
        templateUrl: '/templates/address-form.html'/*,
        controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { } //DOM manipulation*/
    };
});

app.controller('purchaseController', function($scope, $http, $routeParams) {
    
    $scope.rejectFee = function() {
        alert("Too bad - this is u$Pay, not e*Bay!");
    };

    $scope.displaySeller = function() {
        alert("Show information about the seller");
    };

    $scope.formatDate = function(date) {
    
        if (date && date instanceof Date)
        {
            var months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
            var txt  = '';
            var ms = "/";
            var ts = ":";
            
            txt += months[date.getMonth()];
            txt += ms;
            txt += date.getDate();
            txt += ms;
            txt += date.getFullYear();
            txt += ' At ';
            txt += date.getHour();
            txt += ts;
            txt += date.getMinute();
            
            return txt;
        }
        else
        {
            return '';
        }
    };

    /**
     * For now, compute shipping on price points
     */
    $scope.computeShipping = function(total) {

        if (total > 10000)
        {
            return 1000;
        }
        else if (total > 1000)
        {
            return 75;
        }
        else if (total > 100)
        {
            return 15;
        }
        else
        {
            return 4.99;
        }
    };


    $scope.sumBillingDetails = function(billingDetails) {

        var amt = 0;

        if (billingDetails)
        {
            for (var i = 0, l = billingDetails.length; i < l; i++)
            {
                amt += billingDetails[i].amount;
            }
        }

        return amt;
    };

    $scope.discourageQuit = function() {

        $scope.alert = {
            title: "Oh Come On",
            text: "That's one sweet " + $scope.listing.title + "!  You know you want it.  Everyone will think you\'re soooo cool!",
            dismissals: ['Yeah, you\'re right!', 'I guess so', 'OK']
        };

        $('#purchaseModal').modal('show');
    };

    $scope.$on('$viewContentLoaded', function (event) {

        // Get the listing from the server to make sure you have the latest info
        $http.get("/listing/" + $routeParams.listingId).success(function(data) {
            
            $scope.listing = data;

            var st = '';

            if (data && data.user && data.user.address && data.user.address.state)
            {
                st = '(' + data.user.address.state + ')';
            }

            $scope.billingDetails = [{
                description: 'Buy It Now Price',
                amount: data.buyItNowPrice
            }, {
                description: 'Sales Tax ' + st,
                prompt: {
                    text: 'Why do I have to pay sales tax?',
                    click: function() {
                        $scope.alert = {
                            title: "Sales Tax",
                            text: "Sorry, that's the price you pay for being a 'Merican!",
                            dismissals: ['Yes, sir!']
                        };

                        $('#purchaseModal').modal('show');
                    }
                },
                amount: data.buyItNowPrice * .06
            }, {
                description: 'Finder\'s Fee',
                prompt: {
                    text: 'I don\'t want to pay a finder\s fee!',
                    click: function() {
                        $scope.alert = {
                            title: "Finder's Fee",
                            text: "Hey, you won't find sweet loot like this on e*Bay, buddy!  That's the price you pay.",
                            dismissals: ['OK']
                        };

                        $('#purchaseModal').modal('show');
                    }
                },
                amount: data.buyItNowPrice * .1
            }, {
                description: 'Shipping',
                amount: $scope.computeShipping(data.buyItNowPrice)
            }]
        
        }).error(function(err) {
        
            alert("Error " + err);
        });

        // Get the user's information
    });
    
});