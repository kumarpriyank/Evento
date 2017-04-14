/**
 * Created by tornado.the.whirl on 4/8/17.
 */
(function(){
    angular
        .module("Evento")
        .factory("FollowersService", followersService);

    function followersService($http){

        var api = {
            createEventForUser:createEventForUser,
            getFollowersForUser:getFollowersForUser,
            updateFollower:updateFollower,
            getAllUsers:getAllUsers,
            deleteFollower : deleteFollower
        };

        return api;

        function createEventForUser(follower){
            return $http.post("/activity/follow/user",follower);
        }

        function getFollowersForUser(username) {
            return $http.get("/activity/follow/user/" + username);
        }

        function updateFollower(userId, follower) {
            return $http.put("/activity/follow/user/" + userId, follower);
        }

        function getAllUsers(){
            return $http.get("/activity/follow/user");
        }
        function deleteFollower(userId){
            return $http.delete("/api/user/" + userId);
        }
    }
})();