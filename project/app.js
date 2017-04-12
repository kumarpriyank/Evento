module.exports = function (app) {

    var models = require("./models/models.server.js")();

    require("./services/events.service.server.js")(app, models);
    require("./services/users.service.server.js")(app, models);
};