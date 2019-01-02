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
    if (req.body.pageNumber == 0) req.body.pageNumber++;
    var offset = req.body.pageSize * (req.body.pageNumber - 1);
    var query;
    var sortState;


    switch (req.body.sortState) {
        case 0:
            sortState = "(select null)";
            break;
        case 1:
            sortState = `${req.body.columnName} ASC`;
            break;
        case 2:
            sortState = `${req.body.columnName} DESC`;
            break;
    }

    if (req.body.filterData || req.body.filterData === 0) {
        //Filter with sorting

        console.log(1, isNaN(req.body.filterData), req.body.filterData);
        if (isNaN(req.body.filterData)) {

            query = `SELECT * FROM GV_TEST_PERSON_TABLE where ${
        req.body.filterColumnName
      } like '%${
        req.body.filterData
      }%' ORDER BY  ${sortState} OFFSET ${offset} ROWS FETCH NEXT ${
        req.body.pageSize
      } ROWS ONLY`;
        } else {
            console.log(req.body.numericFilterOption);
            query = filterWitSorting(
                req.body.filterColumnName,
                req.body.numericFilterOption,
                req.body.filterData,
                offset,
                sortState,
                req.body.pageSize
            );
        }
    }
    //Sorting
    else if (req.body.columnName) {
        query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY 
     ${sortState} OFFSET ${offset} ROWS FETCH NEXT ${
      req.body.pageSize
    } ROWS ONLY`;
    } else {
        query = `SELECT * FROM GV_TEST_PERSON_TABLE ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${
      req.body.pageSize
    } ROWS ONLY`;
    }
    request.query(query, (err, response) => {
        console.log(query);
        if (err) {
            console.log("Error while querying database :- " + err);
            res.status(406).send("Not acceptable");
        } else {
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

function filterWitSorting(
    filterColumnName,
    numericFilterOption,
    filterdata,
    offset,
    sortState,
    pageSize
) {
    query = `SELECT * FROM GV_TEST_PERSON_TABLE where ${filterColumnName} ${numericFilterOption} ${filterdata} ORDER BY ${sortState} OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
    return query;
}
//Export app
module.exports = app;