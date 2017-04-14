module.exports = function (app, models) {

    var eventModel = models.eventModel;
    app.post("/activity/event", createEvent);
    app.get("/activity/events/:eventId", findEventByEventIdFromDB);
    app.get("/activity/profile/events/:id", findEventByIdFromDB);

    // CREATE A NEW EVENT IF IT DOES NOT EXIST, IF IT EXISTS RETURN THAT EVENT
    function createEvent(req, res) {
        var eventN = req.body;
        eventModel.findEventByEventId(eventN.eventId).then(
                function (event) {
                    if (event)
                        res.json(event);
                    else
                        eventModel.createEvent(eventN).then(
                            function (event) { res.json(event); },
                            function (err) { res.statusCode(404).send(err); });
                },
                function (error) { res.statusCode(404).send(error);});
    }

    // GET THE EVENTS USING EVENTID FROM THE DATABASE
    function findEventByEventIdFromDB(req, res) {
        var eventId = req.params.eventId;
        eventModel.findEventByEventId(eventId).then(
                function (event) { res.json(event); },
                function (error) { res.statusCode(503).send(error); });
    }

    // GET THE EVENTS USING _ID FROM THE DATABASE
    function findEventByIdFromDB(req, res) {
        var id = req.params.id;
        eventModel.findEventById(id).then(
                function (event) { res.json(event); },
                function (error) { res.statusCode(404).send(error); });
    }
};