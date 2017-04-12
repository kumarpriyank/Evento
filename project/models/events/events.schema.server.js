/**
 * Created by tornado.the.whirl on 04/08/17.
 */

/*
 *  Describes how the schema of the EVENTS looks like
 */

// Adding required dependency
var mongoose = require("mongoose");

// Creating a Events Schema Object
var EventsSchema = mongoose.Schema({
    eventId:{
        type:String,
        required:true
    },
    eventName:String,
    eventUrl:String,
    eventImage:String,
    eventStart:String,
    dateCreated: {type: Date, default: Date.now},
    // Explicitly telling which collection to store it in.
}, {collection: "evento.events"});

module.exports = EventsSchema;