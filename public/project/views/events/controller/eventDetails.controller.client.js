/**
 * Created by tornado.the.whirl on 4/11/17.
 */
(function(){
    angular
        .module("Evento")
        .controller("EventDetailController",eventDetailController);


    function eventDetailController($sce, $routeParams, EventService, $rootScope, $location, UserService, CommentService){

        var vm = this;
        vm.eventId = $routeParams.eventId;
        vm.user = $rootScope.currentUser;

        vm.getEventByCategory=getEventByCategory;
        vm.getSafeContent=getSafeContent;
        vm.getSafeImageUrl = getSafeImageUrl;
        vm.getDate = getDate;
        vm.saveThisEvent  = saveThisEvent;
        vm.unsaveThisEvent = unsaveThisEvent;
        vm.createComment = createComment;
        vm.deleteComment = deleteComment;
        vm.getAnotherProfile = getAnotherProfile;

        function init(){

            vm.comments=[];
            if(vm.user){

                // Then get the user related event information
                EventService.findEventByEventIdFromDB(vm.eventId).then(
                    function (res) {
                        var event = res.data;
                        if (event) {
                            UserService.findUserById(vm.user._id).then(
                                function (response) {
                                    var user = response.data;
                                    for (var i in user.eventsLiked) {
                                        if (event._id == user.eventsLiked[i]) {
                                            vm.isEventSaved = true;
                                            return;
                                        }
                                    }
                                    vm.isEventSaved = false;
                                })
                        } else {
                                vm.isEventSaved = false;
                            }
                    });
                $('#commentButton').prop('disabled', false);
            } else
                $('#commentButton').prop('disabled', false);



             // Get the events categories and the event based on event ID
            EventService.getCategoriesList().then(

                function(res){ vm.categories = res.data.categories; },
                function(error){ vm.categories=[]; });

            EventService.getEventbyId(vm.eventId).then(

                function(event){ vm.event = event.data; },
                function(error){ vm.error = "Error occured while fetching event."; });

            CommentService.getCommentByEventId(vm.eventId).then(
                function (res) {
                    vm.comments = res.data;
                    for (var c in vm.comments) {
                        vm.comments[c].dateCreated = new Date(vm.comments[c].dateCreated).toString();
                    }
                },
                function (err) { vm.error = "Error occured while fetching comments"; });
        }
        init();

        /*
         *  Gets events based on category
         */
        function getEventByCategory(category){

            vm.event = category.replace('&',"and");
            $location.url("/event/" + event + "/location/boston")
        }

        /*
         *   Responsible for checking the content marking it safe
         */
        function getSafeContent(content){
            return $sce.trustAsHtml(content);
        }

        /*
         *   Responsible for checking the URL and returning safe URL
         */
        function getSafeImageUrl(logo){
            if(logo)
                return $sce.trustAsResourceUrl(logo.url);
            else
                return "../../../../images/projectImages/no-image.jpg";
        }

        /*
         *  Gets the date from the given date after removing timestamp
         */
        function getDate(date){
            if(date)
                return date.split("T")[0];
            else
                return "25 January 2017";
        }

        /*
         *  Saves the events to the Database
         */
        function saveThisEvent(){
            // Populating the event object
            var event = {
                eventId: vm.eventId,
                eventName: vm.event.name.text,
                eventImage: vm.event.logo.url,
                eventUrl: vm.event.url,
                eventStart: vm.event.start.local
            };


            EventService.createEvent(event).then(
                function (res) {
                    var event = res.data;
                    UserService.findUserById(vm.user._id).then(
                        function (res) {
                            var user = res.data;
                            user.eventsLiked.push(event);
                            return UserService.updateUser(vm.user._id, user);
                        });
                    },
                    function (error) { vm.eventError = "Event creation failed"; }).then(
                        function (success) { init();},
                        function (error) { vm.error = "Error occured while saving event"});
        }

        /*
         *  Deletes the event from the database
         */
        function unsaveThisEvent(){

            EventService.findEventByEventIdFromDB(vm.eventId).then(
                function (res) {
                    var event = res.data;
                    if (event) {
                        UserService.findUserById(vm.user._id).then(
                            function (res) {
                                var user = res.data;
                                for (var u in user.eventsLiked) {
                                    if (event._id == user.eventsLiked[u]) {
                                        user.eventsLiked.splice(u, 1);
                                        break;
                                    }
                                }
                                return UserService.updateUser(vm.user._id, user);
                            });
                        } else
                            vm.isEventSaved = false;
                })
                .then(
                    function (success) { init();},
                    function (error) { init(); });
        }

        /*
         *  Deletes the comment from the database
         */
        function deleteComment(commentId){
            CommentService.deleteComment(commentId).then(   function (success) { init(); },
                    function (error) {  init(); });
        }

        /*
         *  Creates the comment from the database
         */
        function createComment(commentText, commentForm){
            // Resetting the comment field value
            $("#commentText").val('');

            if (commentForm.$valid) {
                var comment = {
                    username: vm.user.username,
                    commentText: commentText,
                    url: vm.user.url,
                    eventId: vm.eventId,
                    eventRating: vm.rating
                };

                CommentService.createComment(comment).then(
                        function (comment) { init(); },
                        function (err) {    vm.commentError = "Error occured while posting comment. Try Again"; });
            }
        }

        /*
         *  Fetches the user profile of user based on username
         */
        function getAnotherProfile(userName){
            if (vm.user && vm.user.username == userName)
                $location.url("/user/profile");
            else
                $location.url("/user/activity/profile/" + userName);
        }
    }
})();