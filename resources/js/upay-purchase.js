app.config(function ($routeProvider) {
    $routeProvider.when("/purchase/:listingId", {
        templateUrl: "templates/purchase.html",
        controller: "purchaseController"
    });
});

app.controller('purchaseController', function($scope, $http, $routeParams) {
    
    $scope.rejectFee = function() {
        alert("Too bad - this is u*Pay, not e*Bay!");
    };

    $scope.getSellerName = function(user) {

        var name = "";
        var sp = "";

        if (user)
        {
            if (user.firstName)
            {
                name += user.firstName;
                sp + " ";
            }
                
            if (user.middleName)
            {
                name += sp + user.middleName;
                sp + " ";
            }

            if (user.lastName)
            {
                name += sp + user.lastName;
                sp + " ";
            }
        }

        return name;
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