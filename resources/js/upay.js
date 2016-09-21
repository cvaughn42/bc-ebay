var app = angular.module("bc-upay", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: '/listings'
    }).when("/listings", {
        templateUrl: "/templates/listings.html",
        controller: 'listingsCtrl'
    }).when("/:id", {
        templateUrl: "/templates/listingDetail.html",
        controller: 'listingDetailCtrl'
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

 app.controller('listingsCtrl', function ($scope, $http){
     $http.get('/listings').success(function(data) {
        $scope.listings = data;
        console.dir(data);
    }).error(function () {
        alert('Unable to load listing: ' + error);
    });
});

app.controller('listingDetailCtrl', function ($scope, $routeParams, $http){
    var id = parseInt($routeParams.id);
        console.log(id);
        $http.post('/listingDetail', {id: id}).success(function(data) {
          $scope.listing = data.filter(function(entry){
            return entry.id === id;
          })[0];
        });
});
