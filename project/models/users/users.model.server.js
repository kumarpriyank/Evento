/**
 * Created by tornado.the.whirl on 04/08/17.
 */

/*
 * Contains the Users related crud operations
 */
module.exports = function () {

    var mongoose = require("mongoose");
    var UserSchema = require("./users.schema.server.js");
    var q = require("q");
    // create entity manager i.e. object that provides api to talk to db
    var User = mongoose.model("User", UserSchema);
    var api = {

        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        createUser: createUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findFacebookUser: findFacebookUser,
        findUserByGoogleId: findUserByGoogleId,
        findAllUsers: findAllUsers
    };
    return api;


    // Finding User By Id
    function findUserById(userId){
        var deferred = q.defer();
        User.findById(userId, function (error, res) {
            if(error || res == null)
                deferred.reject(error);
            else
                deferred.resolve(res);
        });
        return deferred.promise;
    }

    // Find user by username
    function findUserByUsername(username) {
        var deferred = q.defer();
        User.find({username:username}, function (error, res) {
            if(error || res == null)
                deferred.reject(error);
            else
                deferred.resolve(res);
        });
        return deferred.promise;
    }

    // Find User by credentials
    function findUserByCredentials(username,password) {
        var deferred = q.defer();
        User.findOne({username:username, password: password}, function (error, response) {
            if(error || response == null)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Creating a User
    function createUser(user) {
        var deferred = q.defer();
        User.create(user, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Updating a User
    function updateUser(userId, newUser){
        var deferred = q.defer();
        User.update(
            {_id: userId},
            { $set: newUser}, function (error, response) {
                if(error)
                    deferred.reject(error);
                else
                    deferred.resolve(response);
            });
        return deferred.promise;
    }

    // Deleting a User
    function deleteUser(userId){
        var deferred = q.defer();
        User.remove(
            {_id: userId}, function (error, response) {
                if(error)
                    deferred.reject(error);
                else
                    deferred.resolve(response);
            });
        return deferred.promise;
    }

    // Getting a Facebook User
    function findFacebookUser(facebookId){
        var deferred = q.defer();
        User.findOne({"facebook.id": facebookId}, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Getting a Google User
    function findUserByGoogleId(googleId) {
        var deferred = q.defer();
        User.findOne({"google.id": googleId}, function (error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }

    // Find all Users
    function findAllUsers() {
        var deferred = q.defer();
        User.find({role: "u"}, function(error, response) {
            if(error)
                deferred.reject(error);
            else
                deferred.resolve(response);
        });
        return deferred.promise;
    }
};