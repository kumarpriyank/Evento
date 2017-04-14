/**
 * Created by tornado.the.whirl on 4/10/17.
 */

(function () {
    angular
        .module("Evento")
        .factory("EventService", eventService);

    function eventService($http) {

        // HAVE ADDED THE TWO ATTRIBUTES API_TOKEN AND SECRET_API_KEY
        var API_TOKEN = "MC2C7BFV5OVPAOXIB3MS";
        var API_SECRET_FLAG = "JV5WNLVZLGJ54AHNS5TSUIMBYSWIK63YSAKVIGHK7HLEFLNNGG";


        var api = {

            createEvent: createEvent,
            getCategoriesList:getCategoriesList,
            getEventsList:getEventsList,
            getEventbyId:getEventbyId,
            findEventByEventIdFromDB:findEventByEventIdFromDB,
            findEventByIdFromDB:findEventByIdFromDB
        };
        return api;


        // FUNCTION TO CREATE AN EVENT
        function createEvent(event){
            return $http.post("/activity/event",event);
        }

        // FUNCTION MAKING THE API CALLS TO THE EVENTSBRITE API TO GET CATEGORY LIST
        function getCategoriesList(){
            var urlBase = "https://www.eventbriteapi.com/v3/categories/?token=API_TOKEN";
            var updatedUrl = urlBase.replace("API_TOKEN", API_TOKEN);
            return $http.get(updatedUrl);
        }

        // FUNCTION MAKING THE API CALLS TO THE EVENTSBRITE API TO GET EVENT LIST
        function getEventsList(event,location) {
            var urlBase = "https://www.eventbriteapi.com/v3/events/search/?q=EVENT_NAME&location.address=LOCATION_GIVEN&token=API_TOKEN";
            var updatedUrl = urlBase.replace("API_TOKEN", API_TOKEN).replace("EVENT_NAME", event).replace("LOCATION_GIVEN", location);
            return $http.get(updatedUrl);
        }


        // FUNCTION MAKING THE API CALLS TO THE EVENTSBRITE API TO GET EVENT BASED ON ID
        function getEventbyId(eventId){
            var urlBase = "https://www.eventbriteapi.com/v3/events/"+eventId+"/?token=API_TOKEN";
            var updatedUrl = urlBase.replace("API_TOKEN", API_TOKEN);
            return $http.get(updatedUrl);
        }

        // FUNCTION MAKING THE CALLS TO THE DATABASE TO GET EVENT BASED ON EVENT ID
        function findEventByEventIdFromDB(eventId){
            return $http.get("/activity/events/" + eventId);
        }

        // FUNCTION MAKING THE CALLS TO THE DATABASE TO GET EVENT BASED ON ID
        function findEventByIdFromDB(id){
            return $http.get("/activity/profile/events/" + id);
        }
    }
})();
