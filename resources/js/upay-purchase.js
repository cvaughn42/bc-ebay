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

    $scope.$on('$viewContentLoaded', function (event) {

        // Get the listing from the server to make sure you have the latest info
        $http.get("/listing/" + $routeParams.listingId).success(function(data) {
            
            $scope.listing = data;

            console.dir(data);
        
        }).error(function(err) {
        
            alert("Error " + err);
        });

        // Get the user's information
    });
    
});