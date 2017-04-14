/**
 * Created by tornado.the.whirl on 4/9/17.
 */
(function () {
    angular
        .module("Evento")
        .controller("UserProfileController", userProfileController);

    function userProfileController($rootScope, UserService) {

        var vm = this;

        vm.user = $rootScope.currentUser;

        vm.updateUserProfile = updateUserProfile;
        vm.fetchProfileImage = fetchProfileImage;

        init();

        function init(){
            UserService.findUserById(vm.user._id).then(
                    function(res){ vm.user = res.data; });
        }

        function updateUserProfile(user) {
            var userId = vm.user._id;
            UserService.updateUser(userId, user).then(
                    function (res) { vm.success = "Profile Successfully Updated"; },
                    function (error) { vm.error = "Error encountered while updating profile. Try Again"; });
        }


        function fetchProfileImage(){
            if(vm.user.url){
                return vm.user.url;
            }else{
                return "../../../images/projectImages/user.png";
            }
        }
    }
})();
