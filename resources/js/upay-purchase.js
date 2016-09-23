app.config(function ($routeProvider) {
    $routeProvider.when("/purchase/:listingId", {
        templateUrl: "templates/purchase.html",
        controller: "purchaseController"
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

    $scope.$on('$viewContentLoaded', function (event) {

        // Get the listing from the server to make sure you have the latest info
        $http.get("/listing/" + $routeParams.listingId).success(function(data) {
            
            alert("Here!");
            $scope.listing = data;
            $scope.billingDetails = [{
                description: 'Buy It Now Price',
                amount: data.buyItNowPrice
            }, {
                description: 'Finder\'s Fee',
                amount: data.buyItNowPrice * .1
            }, {
                description: 'Sales Tax ( + data.user.address.state + )',
                amount: data.buyItNowPrice * .06
            }]

            console.dir(data);
        
        }).error(function(err) {
        
            alert("Error " + err);
        });

        // Get the user's information
    });
    
});