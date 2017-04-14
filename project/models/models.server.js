/*
 * Entry point to the database
 */
module.exports = function () {

    // Import the Mongoose Library
    var mongoose = require("mongoose");

    // Set the Connection String
    // If the database cs5610spring does not exist then it creates it.
    var connectionString = 'mongodb://127.0.0.1:27017/cs5610spring';



    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }


    //Get the default connection
    mongoose.connect(connectionString);
    var models = {
        userModel: require("./users/users.model.server.js")(),
        eventModel: require("./events/events.model.server.js")(),
        commentModel: require("./comments/comments.model.server.js")(),
        followersModel: require("./followers/followers.model.server.js")()
    };

    return models;
};
