/**
 * Created by tornado.the.whirl on 4/11/17.
 */
/*
 *  Describes how the schema of the COMMENTS looks like
 */

// Adding required dependency
var mongoose = require("mongoose");

// Creating a Events Schema Object
var CommentSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    commentText: String,
    eventId: {
        type: String,
        required: true
    },
    url: String,
    eventRating: String,
    dateCreated: {type: Date, default: Date.now},
    // Explicitly telling which collection to store it in.
}, {collection: "evento.comments"});

module.exports = CommentSchema;