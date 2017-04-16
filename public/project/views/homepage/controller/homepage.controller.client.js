/**
 * Created by tornado.the.whirl on 4/8/17.
 */
(function () {
    angular
        .module("Evento")
        .controller("HomePageController", homepageController);

    function homepageController($location, UserService, $route) {

        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.sendMail = sendMail;
        vm.searchEventByName=searchEventByName;
        vm.searchEventByNameLocation=searchEventByNameLocation;


        // Function that will be called every time
        function init() {
            if(vm.loginError != null || vm.loginSuccess != null){
                vm.registerError=null;
                vm.registerSuccess=null;
            }

            if(vm.registerError != null || vm.registerSuccess != null){
                vm.loginError=null;
                vm.loginSuccess=null;
            }
        } init();

        /*
         *  Responsible for the User Login
         */
        function login(username, password, LoginForm) {

            // Set the messages to null
            vm.loginSuccess = null;
            vm.loginError = null;


            // Check to see if the LoginForm is Valid or not.
            if (LoginForm.$valid) {
                // Call to users service. We will get success of error.
                UserService.login(username, password).then(
                    function (res) {
                            var user = res.data;
                                if (user.role == "u") {
                                    $route.reload();
                                    vm.loginSuccess = "User Login Successful.";
                                } else
                                    $location.url("/admin/" + user._id);
                        },
                    function (err) { vm.loginError = "User not found. Please try again"; });
            } else
                vm.loginError = "Please provide valid username or password";
        }

        /*
         * Responsible for Registering a given User
         */
        function register(username, password, email, RegisterForm) {

            // Set the messages to null
            vm.registerSuccess = null;
            vm.registerError = null;

            if (RegisterForm.$valid && RegisterForm.passwordReg.$modelValue == RegisterForm.verifyPassword.$modelValue) {
                // Create a new users object and update the values.
                var user = {
                    username: username,
                    password: password,
                    firstName: "",
                    lastName: "",
                    email: email,
                    url:'',
                    type: "m",
                    role: "u"
                };

                UserService.register(user).then(
                    function (res) {
                            var user = res.data;
                            vm.registerSuccess = "User Successfully Registered";
                            $route.reload();
                        },
                    function (err) { vm.registerError = err.data; });
            } else {

                vm.registerError = "Registration Error Occured. Please try again";

                if (RegisterForm.password.$modelValue != RegisterForm.verifyPassword.$modelValue)
                    vm.registerError = "Two passwords do not match";
            }
        }

        /*
         * Responsible for Sending an Email
         */
        function sendMail(sendMail, contactForm) {
            if (contactForm.$valid) {
                UserService.sendMail(sendMail).then(
                    function (success) { vm.emailSuccess = "Success"; },
                    function (error) { vm.emailError = "Unable to send Email. Please try again." });
            }
        }

        /*
         * Searches for an event
         */
        function searchEventByName(eventName, form) {
            if ($('#eventNameOnly').val() != "")
                $location.url("/event/" + eventName + "/location/boston");
        }

        /*
         * Searches for an event based on name and location
         */
        function searchEventByNameLocation(event, location, SearchForm) {
            if (SearchForm.$valid) {
                $location.url("/event/" + event + "/location/" + location);
            }
        }
    }
})();