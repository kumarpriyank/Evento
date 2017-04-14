/*
 * Created by Priyank Kumar on 04/08/17.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");
var sg = require('sendgrid').SendGrid('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');

module.exports = function (app, models) {

    /*
     *  Settings for image upload
     */
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/imgUpload' });

    /*
     *  Creating a User Model
     */
    var userModel = models.userModel;

    /*
     *    Defining the request Handlers
     */

    // --------- POST ----------------

    // LOGOUT
    app.post("/api/logout", logout);

    // REGISTER
    app.post("/api/register", register);

    // CREATE A USER -- CHECK USAGE
    app.post("/api/users", createUser);

    // SEND MAIL
    app.post ("/api/mail", sendMail);

    // PASSPORT AUTHENTICATION
    app.post("/api/login", passport.authenticate('project'), login);

    // IMAGE UPLOAD
    app.post ("/profile/uploads", upload.single('myFile'), uploadImage);

    // --------- GET -------------

    // CHECK LOGGED IN
    app.get("/api/loggedIn", loggedIn);

    // FIND USER BY USERNAME
    app.get("/activity/api/user/:username",findUserByUsername);

    // GET ALL USERS/ ONE USER
    app.get("/api/user", getUsers);

    // FIND USER BY USERID
    app.get("/activity/user/:userId",findUserById);


    // -------- PUT --------------

    // UPDATE USER
    app.put("/activity/user/:userId",updateUser);

    // DELETE USER
    app.delete("/api/user/:userId",deleteUser);

    passport.use('project', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);



    /*
     *    Implementing a local strategy
     */
    function localStrategy(username, password, done) {

        userModel.findUserByUsername(username).then(
                function (user) {

                    if (user.length > 0)
                        user=user[0];
                    else
                        done(null, false);

                    if (user && bcrypt.compareSync(password, user.password))
                        done(null,user);
                    else
                        done(null,false);
                },
                function (err) {
                    if (err)
                        done(err);
                }
            );
    }

    /*
     *    Implementing Serialization
     */
    function serializeUser(user, done) {
        done(null, user);
    }

    /*
     *    Implementing Deserialization
     */
    function deserializeUser(user, done) {

        if (user.type == "m") {

            userModel.findUserById(user._id).then(
                    function (user) { done(null, user); },
                    function (err)  { done(err, null); } );
        } else if (user.type == "d") {

            userModel.findUserById(user._id).then(
                    function (user) { done(null, user); },
                    function (err)  { done(err, null); } );
        }
    }


    /*
     * LoggedIn Function
     */
    function loggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.send(req.user);
        } else {
            res.send('0');
        }
    }

    /*
     * LogOut Function
     */
    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    /*
     * Login Function
     */
    function login(req, res) {
        res.json(req.user);
    }

    /*
     * Register Function
     */
    function register(req, res) {
        var user = req.body;
        userModel.findUserByUsername(user.username).then(
            function (usr) {
                if (usr.length > 0)
                    res.statusCode(400).send("Username already exist");
                else {
                    user.password = bcrypt.hashSync(user.password);
                    userModel.createUser(user).then(
                        function (user) {
                            req.login(user, function (err) {
                                if (err)
                                    res.status(400).send(err);
                                else
                                    res.json(user);
                            });
                        });
                    }
                },
                function (error) {
                    res.status(400).send(error);
                });
    }


    /*
     *    Create a new user and add to user list
     */
    function createUser(req, res) {
        var user = req.body;
        userModel.findUserByUsername(user.username).then(
                function (user) {
                    if (user.length > 0)
                        res.statusCode(400).send("User already exist");
                    else {
                        user.password = bcrypt.hashSync(user.password);
                        userModel.createUser(user).then(
                            function (user) { res.json(user); },
                            function (error) { res.statusCode(400).send(error); });
                    }
                },
                function (error) {
                    res.status(400).send(error);
                }
            )
    }

    /*
     *    Updates the user
     */
    function updateUser(req,res){
        var userId = req.params.userId;
        var user = req.body;
        userModel.updateUser(userId,user).then(
                function(user){ res.sendStatus(200); },
                function(error){ res.statusCode(404).send(error); });
    }

    // Using Node sendgrid to send emails- reference https://github.com/sendgrid/sendgrid-nodejs#usage
    var helper = require('sendgrid').mail;

    function sendMail(req,res) {

        var sendMail = req.body;
        var from_email = new helper.Email(sendMail.fromMail);
        var to_email = new helper.Email('priyank07310@gmail.com');
        var subject = 'Hello from the Evento - New Message by' + sendMail.username;
        var content = new helper.Content('text/plain', sendMail.message);
        var mail = new helper.Mail(from_email, subject, to_email, content);


        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function(response) { res.sendStatus(200); }, function (error) { res.statusCode(400).send(error); });

    }

    /*
     *    Upload an Image
     */
    function uploadImage(req, res) {

        // Getting the ID's
        var userId        = req.body.userId;
        var myFile        = req.file;

        if(myFile) {
            // Name of file on the original computer
            var originalname = myFile.originalname;
            // The name by which the file will be put in the upload  folder
            var filename = myFile.filename;
            // The absolute path of the uploaded file
            var path = myFile.path;
            // The destination folder where the file is stored
            var destination = myFile.destination;
            // Size of file
            var size = myFile.size;
            // Mime type of the file
            var mimetype = myFile.mimetype;

            var user = {};


            userModel.findUserById(userId).then(
                function(user){ user = { url : "/imgUpload/" + filename};

                    userModel.updateUser(userId,user).then(
                        function(success){ res.sendStatus(200); },
                        function(error){ res.statusCode(404).send(error); });
                },

                function(error){ res.statusCode(404).send(error); });

            res.redirect("/project/#/user/profile");
        }
        else
            res.redirect("/project/#/user/profile");
    }


    /*
     *    Finding a user based on User Id
     */
    function findUserById(req,res){
        var userId = req.params.userId;
        userModel.findUserById(userId).then(
            function(user){ res.send(user); },
            function(err){ res.statusCode(404).send(err); });
    }


    /*
     *    Finding a user based on Username
     */
    function findUserByUsername(req, res){
        var userName = req.params.username;
        userModel.findUserByUsername(userName).then(
            function(user){ res.json(user); },
            function(err){  res.statusCode(404).send(error); });
    }

    /*
     *    Common function to fetch users based on if username , userId or username and userId provided
     */
    function getUsers(req, res){
        var username = req.query['username'];
        var password = req.query['password'];

        if(username && password)
            getUserByCredentials(username,password,res);
        else if(username)
            getUserByUsername(username,res);
        else
            getAllUsers(request, res);

    }

    /*
     *    Get user by username and password
     */
    function getUserByCredentials(username,password,res){
        userModel.findUserByCredentials(username,password).then(
            function (user) { res.json(user); },
            function(err){ res.statusCode(404).send({});});
    }

    /*
     *    Get user by username
     */
    function getUserByUsername(req,res){
        var username = req.params.username;
        userModel.findUserByUsername(username).then(
            function(user){ res.json(user); },
            function(err){  res.statusCode(404).send(error);});
    }

    /*
     *    Get All Users
     */
    function getAllUsers(req, res){
        userModel.findAllUsers().then(
            function(users){  res.json(users); },
            function(err){  res.statusCode(404).send({}); });
    }


    /*
     *    Delete User
     */
    function deleteUser(req,res){
        var userId = req.params.userId;
        userModel.deleteUser(userId).then(
            function(succ){  res.send(200); },
            function(err){  res.statusCode(404).send(error); });
    }
};