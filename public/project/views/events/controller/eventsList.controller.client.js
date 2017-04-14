/**
 * Created by tornado.the.whirl on 4/10/17.
 */
(function(){
    angular
        .module("Evento")
        .controller("EventListController",eventListController);

    function eventListController($sce, $routeParams,EventService){

        var vm = this;

        vm.event = $routeParams.eventName;
        vm.location = $routeParams.location;

        vm.getSafeImageUrl = getSafeImageUrl;
        vm.getDate = getDate;
        vm.getEventByCategory = getEventByCategory;

        /*
         *  Initialise the categories List and the
         */
        function init(){

            EventService.getCategoriesList().then(

                function(res){ vm.categories = res.data.categories; },
                function(error){ vm.categories=[]; });

            EventService.getEventsList(vm.event, vm.location).then(

                function(events){ vm.events = events.data.events; },
                function(error){ vm.error = "No Results Found for event"; });
        }
        init();

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
         *  Gets events based on category
         */
        function getEventByCategory(category){

            vm.event = category.replace('&',"and");
            init();
        }
    }
})();