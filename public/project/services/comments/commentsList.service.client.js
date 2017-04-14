/**
 * Created by tornado.the.whirl on 4/12/17.
 */
(function () {
    angular
        .module("Evento")
        .factory("CommentService", commentService);

    function commentService($http) {

        var api={
            createComment : createComment,
            deleteComment : deleteComment,
            getCommentByEventId : getCommentByEventId
        }
        return api;

        function createComment(comment) {
            return $http.post("/activity/comment",comment);
        }

        function deleteComment(commentId){
            return $http.delete("/activity/comment/" + commentId);
        }

        function getCommentByEventId(eventId){
            return $http.get("/activity/comment/" + eventId);
        }
    }
})();