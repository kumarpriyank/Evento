/**
 * Created by tornado.the.whirl on 4/12/17.
 */
module.exports = function (app, models) {

    var followersModel = models.followersModel;

    app.post("/activity/follow/user", createEventForUser);
    app.get("/activity/follow/user/:username", getFollowersForUser);
    app.put("/activity/follow/user/:userId", updateFollower);
    app.get("/activity/follow/user", getAllUsers);


    // Registering the event with the user
    function createEventForUser(req, res) {
        var followerNew = req.body;
        followersModel.createEventForUser(followerNew).then(
            function (user) { res.json(user); },
            function (err) { res.statusCode(404).send(err); });
    }

    // Get Followers for the user
    function getFollowersForUser(req, res) {
        var username = req.params.username;
        followersModel.getFollowersForUser(username).then(
            function (user) { res.json(user); },
            function (err) { res.send(error); });
    }

    // Update the followers
    function updateFollower(req, res) {
        var userId = req.params.userId;
        var followerNew = req.body;

        return followersModel.updateFollower(userId, followerNew).then(
            function (success) {  res.send(200); },
            function (err) { res.statusCode(404).send(error);});
    }

    // Get all followers
    function getAllUsers(req, res){
        followersModel.getAllUsers().then(
            function (users) { res.send(users); },
            function (err) {  res.statusCode(404).send(error); });
    }
};