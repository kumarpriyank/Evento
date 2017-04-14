/**
 * Created by tornado.the.whirl on 4/14/17.
 */
"use strict";
(function () {
    angular
        .module("Evento")
        .controller("AdminController", adminController);

    function adminController(UserService, $rootScope) {

        var vm = this;

        vm.user = $rootScope.currentUser;
        vm.checkUserName = 'username';
        vm.isReverse = true;

        vm.selectUserAdmin = selectUserAdmin;
        vm.addUserAdmin = addUserAdmin;
        vm.updateUserAdmin = updateUserAdmin;
        vm.deleteUserAdmin = deleteUserAdmin;

        function init() {

            vm.selectedUser = {};
            vm.isUserSelected = -1;

            UserService.fetchAllUsers().then(
                function (success) {  vm.users = success.data; },
                function (error) {  vm.error = error; });

        }
        init();


        function selectUserAdmin(user){
            vm.selectedUser = angular.copy(user);
            vm.isUserSelected = 0;
        }

        function deleteUserAdmin(user){
            UserService.removeUser(user._id).then(
                function(success) {
                    vm.users = success.data;
                    init();
                },
                function(err) { vm.error = error.data; });
        }

        function updateUserAdmin(user) {
            UserService.updateUser(user._id, user).then(
                function (success) {
                    vm.users = success.data;
                    init();
                },
                function (err) {    vm.error = error.data;  });
        }

        function addUserAdmin(user) {

            if(!user){
                if(user.username == "")
                    vm.error =  "  User Name required";
                vm.error =  "  Try Again";
            }
            else{
                console.log(user.password);
                if(user.password == undefined)
                    user.password = user.username;

                UserService.createUser(user).then(
                    function (success) {
                        vm.users = success.data;
                        init(); },
                    function (err) {    vm.error = err.data;  });
            }
        }

        vm.orderColumn = function (checkUserName) {
            vm.isReverse = (vm.checkUserName == checkUserName) ? !vm.isReverse : false;
            vm.checkUserName = checkUserName;
        };

    }
})();