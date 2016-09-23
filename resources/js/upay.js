var app = angular.module("bc-upay", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: '/listings'
    }).when("/newListing", {
        templateUrl: "/templates/newListing.html",
        controller: 'newListingCtrl'
    })
    .when("/listings", {
        templateUrl: "/templates/listings.html",
        controller: 'listingsCtrl'
    }).when("/:id", {
        templateUrl: "/templates/listingDetail.html",
        controller: 'listingDetailCtrl'
    }).when("/profile/:userName", {
        templateUrl: "/templates/profile.html",
        controller: 'profileCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

app.directive("logo", function() {
    return {
        template : "<a class='navbar-brand' href='#/'>u<sup><i class='fa fa-dollar'></i></sup>Pay</a>"
    };
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
        console.log(JSON.stringify(data));
    }).error(function () {
        alert('Unable to load listing: ' + error);
    });

    $scope.$on('searchEvent', function (event, srchTerm) {
        console.log(srchTerm); 
        $http.post('/search',{srchTerm: srchTerm}).success(function(data) {
            $scope.listings = data;
            console.log(JSON.stringify(data));
        }).error(function () {
            alert('Unable to load listing: ' + error);
        });
    });

    $scope.buyNow=function(){
        $http.post('/buyNow', {title: $scope.title}).success(function(data) {
        console.log(JSON.stringify(data));
        $scope.listings = data;
        $location.path('/listings');
        }).error(function () {
            alert('Unable to add new listing: ' + error);
        });
    };
});

app.controller('listingDetailCtrl', function ($scope, $routeParams, $http){
    var id = parseInt($routeParams.id);
        console.log(id);
        $http.post('/listingDetail', {id: id}).success(function(data) {
          $scope.listing = data.filter(function(entry){
            return entry.id === id;
          })[0];
        }).error(function () {
            alert('Unable to load listingDetail: ' + error);
        });
});

app.controller('newListingCtrl', function ($scope, $routeParams, $http, $location){
    $scope.addNewListing=function(){
        $http.post('/newListing', {title: $scope.title}).success(function(data) {
        console.log(JSON.stringify(data));
        $scope.listings = data;
        $location.path('/listings');
        }).error(function () {
            alert('Unable to add new listing: ' + error);
        });
    };
});

app.controller('profileCtrl', function ($scope, $routeParams, $http){
    var userName = $routeParams.userName;
    console.log(userName);
    $http.post('/profile', {userName: userName}).success(function(data) {
        console.log(JSON.stringify(data));
        $scope.profileUser = data;
    }).error(function () {
        alert('Unable to load user profile: ' + error);
    });

    $scope.updateProfile = function() {    
        $http.post('/updateProfile', {profileUser: $scope.profileUser}).success(function(data) {

        }).error(function () {
            alert('Unable to update user profile: ' + error);
        });
    };
});
