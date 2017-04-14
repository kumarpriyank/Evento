/**
 * Created by tornado.the.whirl on 4/11/17.
 */

// Adding required dependency
var mongoose = require("mongoose");

// Creating a Events Schema Object
var FollowersSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    followedUser:[{type: String}],
    dateCreated: {type: Date, default: Date.now},
    // Explicitly telling which collection to store it in.
}, {collection: "evento.followers"});

module.exports = FollowersSchema;