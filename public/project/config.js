/**
 * Created by tornado.the.whirl on 4/8/17.
 */

(function () {
    angular
        .module("Evento")
        .config(Configuration);

    function Configuration($routeProvider, $locationProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl: "views/homepage/view/homepage.view.client.html",
                controller: "HomePageController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }})
            .when("/admin/:userId",{
                templateUrl: "views/admin/view/adminusers.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkProfileAccess
                }})
            .when("/user/profile", {
                templateUrl: "views/usersProfile/views/userProfile.view.client.html",
                controller: "UserProfileController",
                controllerAs: "model",
                resolve:{
                    loggedIn: checkProfileAccess
                }})
            .when("/user/activity/profile/:username", {
                templateUrl: "views/usersProfile/views/otheruserprofile.view.client.html",
                controller: "OtherUserProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }})
            .when("/event/:eventName/location/:location", {
                templateUrl: "views/events/views/eventsList.view.client.html",
                controller: "EventListController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }})
            .when("/event/:eventId", {
                templateUrl: "views/events/views/eventDetails.view.client.html",
                controller: "EventDetailController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }})

       // $locationProvider.html5Mode(true);
    }

    function checkProfileAccess($location, UserService, $q, $rootScope){
        var deferred = $q.defer();
        UserService.loggedIn().then(
            function(response){
                var user = response.data;

                if(user == 'Not Found') {
                    $rootScope.currentUser = null;
                    deferred.reject();
                    $location.url("/"); }
                else{
                    $rootScope.currentUser = user;
                    deferred.resolve();
                }},

            function(error){ $location.url("/"); } );
        return deferred.promise;
    }

    function checkLoggedIn($location, UserService, $q, $rootScope) {
        var deferred = $q.defer();
        UserService.loggedIn().then(
                function (response) {
                    var user = response.data;
                    if (user == 'Not Found')
                        $rootScope.currentUser = null;
                    else
                        $rootScope.currentUser = user;

                    deferred.resolve();
                },
                function (error) { $location.url("/"); } );
        return deferred.promise;
    }

})();
