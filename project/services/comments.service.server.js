/**
 * Created by tornado.the.whirl on 4/12/17.
 */

module.exports = function (app, models) {

    var commentModel = models.commentModel;

    app.post("/activity/comment", createComment);
    app.get("/activity/comment/:eventId", getCommentByEventId);
    app.delete("/activity/comment/:commentId", deleteComment);

    // Create a Comment
    function createComment(req,res){

        var newComm = req.body;
        var userId = req.params.userId;

        commentModel.createComment(newComm).then(
            function(comment){  res.json(comment); },
            function(err){ res.statusCode(404).send(err); });
    }

    // Fetch a comment by Event Id
    function getCommentByEventId(req,res){
        var eventId = req.params.eventId;

        commentModel.getCommentByEventId(eventId).then(
            function(comment){ res.json(comment); },
            function(err){ res.sendStatus(404).send(err);});
    }

    //Delete a comment by the comment ID
    function deleteComment(req, res) {
        var commentId = req.params.commentId;

        commentModel.deleteComment(commentId).then(
            function(success){ res.sendStatus(200); },
            function(err) { res.statusCode(404).send(err); });
    }
};