/**
 * Created by tornado.the.whirl on 4/11/17.
 */
/*
 * Contains the Comments related CRUD operations
 */
module.exports = function () {

    var mongoose = require("mongoose");
    var CommentSchema = require("./comments.schema.server.js");
    var q = require("q");


    // create entity manager i.e. object that provides api to talk to db
    var Comment = mongoose.model("Comment",CommentSchema);

    var api = {
        createComment: createComment,
        getCommentByUserName: getCommentByUserName,
        getCommentByEventId: getCommentByEventId,
        deleteComment: deleteComment
    };

    return api;

    // Creates a new Comment in the Database
    function createComment(comment) {
         return Comment.create(comment);
    }

    // Finds a comment in the database based on the username
    function getCommentByUserName(username){
        return Comment.find({"username": username})
    }

    // Finds the comment in the databases based by Event ID
    function getCommentByEventId(eventId){
          return Comment.find({"eventId": eventId}).sort({dateCreated: 1});
    }

    // Removes the given comment from the database
    function deleteComment(commentId){
        return Comment.remove({_id: commentId});
    }
};
