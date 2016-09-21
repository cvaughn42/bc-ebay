var app = angular.module("bc-upay", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider.when("/listing", {
        templateUrl: "/templates/listing.html",
        controller: 'listingCtrl'
    }).when("/:id", {
        templateUrl: "/templates/detail.html",
        controller: 'detailCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

app.controller('bc-upay-controller', function ($scope, $rootScope, $routeParams, $http, $route, $q) {
    $http.get('/currentUser').success(function (data) {
        $scope.currentUser = data;
        console.dir(data);
    }).error(function () {
        alert('Unable to load currentUser: ' + error);
    });

});

 app.controller('listingCtrl', function ($scope, $http){
   
});

app.controller('detailCtrl', function ($scope, $routeParams, $http){


});
