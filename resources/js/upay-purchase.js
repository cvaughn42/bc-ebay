app.config(function ($routeProvider) {
    $routeProvider.when("/purchase/:listingId", {
        templateUrl: "templates/purchase.html",
        controller: "purchaseController"
    });
});

app.controller('purchaseController', function($scope, $http, $routeParams) {
    
    // Get the listing
    $http("/listing/" + $routeParams.listingId, function(data) {
        $scope.listing = data;
    });

    // Get the user's information

    
});