/**
 * Created by tornado.the.whirl on 4/8/17.
 */
(function(){
    angular
        .module("Evento")
        .factory("UserService", userService);

    function userService($http){
        var api={
            createUser : createUser,
            login : login,
            logout : logout,
            loggedIn : loggedIn,
            register: register,
            sendMail: sendMail,
            updateUser:updateUser,
            removeUser : removeUser,
            fetchAllUsers: fetchAllUsers,
            findUserById:findUserById,
            findUserByUsername:findUserByUsername,
            findUserByCredentials : findUserByCredentials
        };

        return api;

        function logout(){
            return $http.post("/api/logout");
        }

        function loggedIn(){
            return $http.get("/api/loggedIn")
        }

        function login(username,password){
            var user = {
                username: username,
                password: password
            };
            return $http.post("/api/login",user);
        }

        function register(user){
            return $http.post("/api/register",user);
        }

        function createUser(user){
            return $http.post("/api/users",user);
        }

        function sendMail(sendMail){
            return $http.post("/api/mail",sendMail);
        }

        function updateUser(userId, usr){
            return $http.put("/activity/user/" + userId, usr);

        }

        function findUserById(userId){
            return $http.get("/activity/user/" + userId);
        }

        function findUserByUsername(username){
            return $http.get("/activity/api/user/"+username);
        }

        function removeUser(userId){
            return $http.delete("/api/user/" + userId);
        }

        function fetchAllUsers(){
            return $http.get("/api/user");
        }

        function findUserByCredentials(username,password){
            return $http.get("/api/user?username="+username+"&password="+password);
        }
    }
})();
