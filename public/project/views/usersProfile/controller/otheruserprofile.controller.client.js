/**
 * Created by tornado.the.whirl on 4/10/17.
 */
(function () {
    angular
        .module("Evento")
        .controller("OtherUserProfileController", otherUserProfileController);

    function otherUserProfileController(EventService, UserService, $route, $routeParams, $location, $rootScope, FollowersService, $anchorScroll) {

        // Need to initilize the variables required for this service
        var vm = this;
        vm.loggedInUser = $rootScope.currentUser;
        vm.username = $routeParams.username;
        vm.addUser = addUser;
        vm.removeUser = removeUser;

        init();

        // Get all the values before loading the page
        function init(){

            // INITIALIZE AGAIN
            vm.isUserFollowing = false;
            vm.membersFollowing = [];
            vm.membersFollowers = [];
            vm.eventsLikedMember = [];


            // POPULATING THE FOLLOWED USERS
            if (vm.loggedInUser) {
                FollowersService.getFollowersForUser(vm.loggedInUser.username).then(
                    function (res) {
                        var user = res.data;
                        if (user) {
                            var membersFollowing = user.followedUser;
                            for (var index in membersFollowing) {
                                if (membersFollowing[index] == vm.username)
                                    vm.isUserFollowing = true;
                            } } });
            }

            //POPULATING THE FOLLOWING USERS LIST
            FollowersService.getFollowersForUser(vm.username).then(
                function (res) {
                    var user = res.data;
                    if (user) {
                        for (var usr in user.followedUser) {
                            UserService.findUserByUsername(user.followedUser[usr]).then(
                                function (res) { vm.membersFollowing.push(res.data[0]); });
                        }
                    }
                });

            // GETTING FOLLOWERS FOR A VISITED PROFILE
            FollowersService.getAllUsers().then(
                function (res) {
                    var userList = res.data;
                    for (var user in userList) {
                        for (var followed in userList[user].followedUser) {
                            var userSelected = userList[user];
                            if (userSelected.followedUser[followed] == vm.username) {
                                UserService.findUserByUsername(userSelected.username).then(
                                    function(res) { vm.membersFollowers.push(res.data[0]); },
                                    function (err) { vm.membersFollowers = [];});
                            }
                        }
                    }
                });

            // FIND THE USER BY USERNAME
            UserService.findUserByUsername(vm.username).then(
                function(res) {
                    vm.userNow = res.data;
                    for (var event in  vm.userNow.eventsLiked){
                        EventService.findEventByIdFromDB( vm.userNow.eventsLiked[event]).then(
                            function (succ) {  vm.eventsLikedMember.push(succ.data[0]); },
                            function (err) { vm.eventsLikedMember = []; });
                    }
                },
                function (error) {
                    vm.loggedInUserError = "Unable to load user profile. Please try again";  });

        }

        // Follow a User and add yourself to the following user followers
        function addUser() {
            FollowersService.getFollowersForUser(vm.loggedInUser.username).then(
                function (res){
                    var user = res.data;
                    if (user){
                        user.followedUser.push(vm.username);

                        FollowersService.updateFollower(user._id, user).then(
                            function (succ) { init(); },
                            function (err) { init(); });
                    } else {
                        user = {
                                    username: vm.loggedInUser.username,
                                    followedUser: [vm.username]
                                };

                        FollowersService.createEventForUser(user).then(
                            function (succ) { init(); },
                            function (err) { init(); });
                    }
                });
            }

        // Unfollow a User and remove yourself from the following user followers list
        function removeUser(){
            FollowersService.getFollowersForUser(vm.loggedInUser.username).then(
                function (res){
                    var user = res.data;
                    if (user){
                        for (var followed in user.followedUser) {
                                if (user.followedUser[followed] == vm.username)
                                    user.followedUser.splice(followed, 1);
                        }

                        FollowersService.updateFollower(user._id, user).then(
                            function (succ) { init(); },
                            function (err) { init(); });
                    }
                },
                function (err) { init(); });
        }
    }

})();