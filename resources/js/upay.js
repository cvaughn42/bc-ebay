var app = angular.module("bc-upay", ['ngRoute', 'ui.utils.masks', 'datePicker']);

app.config(['$httpProvider', function ($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.common = {};
    }
    $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
    $httpProvider.defaults.headers.common.Pragma = "no-cache";
    $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";
}]);

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: '/listings'
    }).when("/newListing/:userName", {
        templateUrl: "/templates/newListing.html",
        controller: 'newListingCtrl'
    }).when("/listings", {
        templateUrl: "/templates/listings.html",
        controller: 'listingsCtrl'
    }).when('/todo', {
        templateUrl: '/templates/todo.html'
    }).when("/listing/:listingId", {
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

app.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});
app.filter('tel', function () {
    return function (tel) {

        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});

app.controller('bc-upay-controller', function ($scope, $rootScope, $routeParams, $http, $route, $q, $location) {
    $http.get('/currentUser', {cache: false}).success(function (data) {
        $scope.currentUser = data;
        // console.dir(data);
    }).error(function () {
        alert('Unable to load currentUser: ' + error);
    });

    $scope.search = function() {
        $scope.$broadcast('searchEvent', $scope.srchTerm);
    };
    $scope.filterOn = function(keyword){
        $scope.$broadcast('filterOnEvent', keyword);
    }

    $scope.uploadListingFiles = function (listingId) {
        $('#listingId').val(listingId);

        // need to remove the div created by dropzone.js after success uploading of the file(s)
        // <div class='dz-preview dz-processing dz-image-preview dz-success dz-complete' />
        var divRemove = $('div.dz-preview, .dz-processing, .dz-image-preview, .dz-success, .dz-complete');
        $(divRemove).remove();

        $('#uploadModal').modal('show');
    };
    //fixed search --- search
    $scope.$on('searchEvent', function (event, srchTerm) {
        $http.post('/search',{srchTerm: srchTerm, cache: false}).success(function(data) {
            console.dir("getting result : "+data);
            $scope.listings = data;
            console.log(JSON.stringify(data));
            $location.path('/listings');
            location.reload(true);
            
        }).error(function () {
            alert('Unable to load listing: ' + error);
        });
    });

});
function getKeywords (data){
        var keywords = [];

        for (var i = 0, l = data.length; i < l; i++)
        {
            if (data[i].keywords && data[i].keywords.length)
            {
                for (var i2 = 0, l2 = data[i].keywords.length; i2 < l2; i2++)
                {
                    if (keywords.indexOf(data[i].keywords[i2]) === -1)
                    {
                        keywords.push(data[i].keywords[i2]);
                    }
                }
            }
        }

        keywords.sort(function(a, b) {
            if (typeof(a) === 'string')
            {
                a = a.toLowerCase();
            }
            if (typeof(b) === 'string')
            {
                b = b.toLowerCase();
            }

            if (a < b)
            {
                return -1;
            }
            else if (a > b)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        });
        return keywords;
}
app.controller('listingsCtrl', function ($scope, $http, $location){
     $http.get('/listings', {cache: false}).success(function(data) {
        
        $scope.listings = data;
        // console.dir($scope.listings);
        var keywords = getKeywords(data);
        $scope.removeFilter = function (keyword){
            console.log('in!');
            console.log('keyword is : ' + keyword);

            var buildKeywords = null;
            
            for(var i = $scope.listings.length-1 ; i >= 0 ; i--){
                console.log('keyword: '+ keyword +' value : ' + $scope.listings[i].keywords + ' does contain : ' + ($scope.listings[i].keywords.indexOf(keyword) != -1));
                if($scope.listings[i].keywords.indexOf(keyword) != -1){
                    console.log('removing = ' + $scope.listings[i]);
                    $scope.listings.splice(i, 1);
                    console.log('index ' + i + ' length of array ' + $scope.listings.length);
                    // i--;
                }
            }
            keywords = getKeywords($scope.listings);
            $scope.keywords = keywords;
        }
        $scope.keywords = keywords;

    }).error(function () {
        alert('Unable to load listing: ' + error);
    });

    $scope.$on('filterOnEvent', function( event, filterOnTerm){

        $http.post('/listing',{filterOnTerm: filterOnTerm, cache:false}).success(function (listingData){
            $scope.listings = listingData;
            
        }).error(function (error){
            console.log("error is " + error);

        });
    });
});

app.controller('listingDetailCtrl', function ($scope, $routeParams, $http){

    $scope.displaySeller = function(sellerId) {
        
        $('#sellerInfoModal').modal('show');

        $http.get('/getSellerInfo/' + sellerId, {cache: false}).success(function(data) {

            $scope.seller = data;

            if (data.sinceDate && !(data.sinceDate instanceof Date))
            {
                data.sinceDate = new Date(data.sinceDate);
            }
        }).error(function(err) {
            alert("Unable to retrieve seller information for seller " + sellerId + ": " + err);
        });
    };
    
    var listingId = parseInt($routeParams.listingId);
        // console.log(listingId);
        $http.get('/listing/'+listingId, {cache: false}).success(function(data) {
          $scope.listing = data;
        }).error(function () {
            alert('Unable to load listingDetail: ' + error);
        });
});

app.controller('newListingCtrl', function ($scope, $routeParams, $http, $location){

    $scope.newListing = {};
    $scope.today = new Date();
    $scope.newListing.keywords = [];

    $scope.addKeyword = function() {
        var newItemNo = $scope.newListing.keywords.length+1;
        $scope.newListing.keywords.push($scope.newKeyword);
        $scope.newKeyword = '';
    };
        
     $scope.removeKeyword = function(value) {
        var index = $scope.newListing.keywords.indexOf(value);
        if ( index >= 0 ) {
            $scope.newListing.keywords.splice(index, 1);
        }
    };

    $scope.addNewListing=function(){
        console.log('keywords: ', JSON.stringify($scope.newListing.keywords));
        $scope.newListing.sold = false;
        $scope.newListing.minBid = 0;
        var userName = $routeParams.userName;
        $scope.newListing.user = {};
        $scope.newListing.user.userName = userName;
        console.log('new listing: ', JSON.stringify($scope.newListing));
        if ($scope.newListing.title) {
            $http.post('/newListing', {newListing: $scope.newListing}).success(function(count) {
                console.log(JSON.stringify(count));
                }).error(function (error) {
                    alert('Unable to add new listing with keywords: ' + error);
                });
        }
    };
});

app.controller('profileCtrl', function ($scope, $routeParams, $http){
    var userName = $routeParams.userName;
    $scope.successfulAlert = true;
 
    $http.get('/profile/'+userName, {cache: false}).success(function(data) {
        $scope.profileUser = data;
        $scope.successfulAlert = true;
        console.dir(data);
    }).error(function () {
        $scope.successfulAlert = true;                
        alert('Unable to load user profile: ' + error);
    });

     $scope.uploadUserImage = function() {

         if (!$('#userImageFile').val())
         {
             alert("Please select a user image to upload");
             $('#userImageFile').focus();
         }
         else 
         {
            var formData = new FormData();
            formData.append('file', document.getElementById('userImageFile').files[0]);
            formData.append('userName', $scope.profileUser.userName);

            $http.post("/userImage", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) { 
                location.reload(true); 
            }).error(function (response) { 
                alert(response); 
            });
         }
    };

    $scope.updateProfile = function() {    
        $http.post('/updateProfile', {profileUser: $scope.profileUser}).success(function(data) {
        
            $scope.successfulAlert = false;
        }).error(function (error) {
            $scope.successfulAlert = true;
            alert('Unable to update user profile: ' + error);
        });
    };
});