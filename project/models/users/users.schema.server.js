/**
 * Created by tornado.the.whirl on 04/08/17.
 */

/*
 *  Describes how the schema of the users looks like
 */

// Adding required dependency
var mongoose = require("mongoose");

// Creating a User Schema Object
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:String,
    facebook:{
        token: String,
        id: String,
        displayName: String
    },
    google: {
        token: String,
        id: String,
        displayName: String
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    role: {
        type: String,
        default: 'u'
    },
    facebookLink: String,
    dateofBirth: {
        type: Date,
        default: Date.now
    },
    url: String,
    type: {
        type: String,
        default: 'm'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    eventsLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    }]
    // Explicitly telling which collection to store it in.
}, {collection: "evento.users"});

module.exports = UserSchema;