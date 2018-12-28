//Launch Express
var express = require("express");
var app = express();

// Body Parser Middleware
var bodyParser = require("body-parser");
app.use(bodyParser.json());

//CORS
const cors = require("cors");
app.use(cors());

//SQL
const sql = require("./config");

//Querries
//For Client-Side Pagination
app.get("/", (req, res, next) => {
    var request = new sql.Request();
    var query = "SELECT * FROM GV_TEST_PERSON_TABLE";
    request.query(query, (err, response) => {
        if (err) {
            console.log("Error while querying database :- " + err);
            res.status(406).send("Not acceptable");
        } else {
            res.status(200).send(response.recordset);
        }
    });
});

//For Server-Side Pagination
app.post("/", (req, res, next) => {
    var request = new sql.Request();
    var offset = req.body.pageSize * req.body.pageNumber;
    var query;
    if (req.body.columnName) {
        if (req.body.sortState === 0) {
            query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${req.body.pageSize} ROWS ONLY`;
        } else if (req.body.sortState === 1) {
            query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY ${req.body.columnName} ASC OFFSET ${offset} ROWS FETCH NEXT ${req.body.pageSize} ROWS ONLY`;
        } else if (req.body.sortState === 2) {
            query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY ${req.body.columnName} DESC OFFSET ${offset} ROWS FETCH NEXT ${req.body.pageSize} ROWS ONLY`;
        }
    } else {
        query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${req.body.pageSize} ROWS ONLY`;
    }
    request.query(query, (err, response) => {
        console.log(query);
        if (err) {
            console.log("Error while querying database :- " + err);
            res.status(406).send("Not acceptable");
        } else {
            console.log(response.recordset);
            res.status(200).send(response.recordset);
        }
    });
});

//Default errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

//Export app
module.exports = app;