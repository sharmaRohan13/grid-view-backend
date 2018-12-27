var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");

var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    user: "sa",
    password: "Welcome@1234",
    server: "GGKU5SER2",
    database: "AFT_TestDB"
};

//Function to connect to database and execute query
var executeQuery = function (response, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        } else {
            console.log("Connected to DataBase");
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, res) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    response.send(err);
                } else {
                    response.send(res.recordset);
                }
            });
        }
    });
}

//GET API
app.get("/api/user", function (req, res) {
    var query = "select * from GV_TEST_PERSON_TABLE";
    sql.close();
    executeQuery(res, query);
});