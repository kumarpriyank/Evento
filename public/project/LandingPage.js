/*
 *  Create By : Priyank Kumar on April 7 2017
 */
(function () {
    angular
        .module("Evento", ["ngRoute","ngRating"])
        .controller("EventoController", eventoController);

    function eventoController($route, $anchorScroll, $location, UserService) {

        var vm = this;

        vm.switchTo = switchTo;
        vm.logout = logout;
        vm.searchEventByName = searchEventByName;
        vm.isAdminTrue = isAdminTrue;
        vm.goToCurrentUser = goToCurrentUser;
        vm.goToUserProfile = goToUserProfile;

        // Function to maintain the movement of control in the page
        function switchTo(element) {
            $location.url("/");
            var previousValue = $location.hash();
            $location.hash(element);
            $anchorScroll();
            // Reset to the old one
            $location.hash(previousValue);
        }

        // Function to log out the user
        function logout() {
            UserService.logout().then(
                    function(res){ $location.url("/"); $route.reload(); },
                    function(error){ $location.url("/"); $route.reload(); });
        }

        /*
         * Searches for an event
         */
        function searchEventByName(eventName, form) {
            if(eventName != "")
                $location.url("/event/" + eventName + "/location/boston");
        }

        /*
         *   The user is an admin user so need to route him
         */
        function isAdminTrue(userId){
            $location.url("/admin/" + userId);
        }

        /*
         *   Rououte to the user profile.
         */
        function goToCurrentUser(userId){
            console.log(userId);
            $location.url("/user/profile");
        }


        /*
         *   Rououte to the user profile.
         */
        function goToUserProfile(username){
            $location.url("/user/activity/profile/" + username);
        }

    }
})();