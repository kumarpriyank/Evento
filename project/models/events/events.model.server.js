/**
 * Created by tornado.the.whirl on 04/08/17.
 */

/*
 * Contains the Users related crud operations
 */
module.exports = function () {

    var mongoose = require("mongoose");
    var EventSchema = require("./events.schema.server.js");
    var q = require("q");

    // create entity manager i.e. object that provides api to talk to db
    var Event = mongoose.model("Event", EventSchema);

    var api = {
        findEventById: findEventById,
        findEventByEventId: findEventByEventId,
        createEvent: createEvent
    };
    return api;


    // Finds the events matching a specific event
    function findEventById(id) {
        var deferred = q.defer();
        return Event.findOne({"_id": id}, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Finds events by EventId's
    function findEventByEventId(eventId) {
        var deferred = q.defer();
        Event.findOne({"eventId": eventId}, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Creates an event
    function createEvent(event) {
        var deferred = q.defer();
        Event.create(event, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

/*
    function findCommentByUserName(username) {
        return Comment.find({"username": username})
    }

    function findCommentByEventId(eventId) {
        return Comment.find({"eventId": eventId}).sort({dateCreated: 1});
    }

    function removeComment(commentId) {
        return Comment.remove({_id: commentId});
    }*/
};