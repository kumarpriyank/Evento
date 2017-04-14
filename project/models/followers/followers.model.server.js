/**
 * Created by tornado.the.whirl on 4/11/17.
 */
/*
 * Contains the Followers related CRUD operations
 */
module.exports = function () {

    var mongoose = require("mongoose");
    var FollowersSchema = require("./followers.schema.server.js");
    var q = require("q");

    // create entity manager i.e. object that provides api to talk to db
    var Followers = mongoose.model("Followers",FollowersSchema);

    var api = {

        createEventForUser : createEventForUser,
        getFollowersForUser : getFollowersForUser,
        getAllUsers : getAllUsers,
        updateFollower : updateFollower
    };

    return api;

    // Creates event for the users
    function createEventForUser(followers){
        var deferred = q.defer();
        return Followers.create(followers, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Get all followers for the given user
    function getFollowersForUser(username){
        var deferred = q.defer();
        return Followers.findOne({"username": username}, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Fetch all the users who are being followed
    function getAllUsers(){
        return Followers.find();
    }

    // Update Follower
    function updateFollower(userId, user){
        delete user._id;
        return Followers.update({_id: userId},{ $set: user});
    }
};