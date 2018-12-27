const sql = require("mssql");

var dbConfig = {
    user: "sa",
    password: "Welcome@1234",
    server: "GGKU5SER2",
    database: "AFT_TestDB",
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

sql.connect(dbConfig, (err) => {
    if (err) {
        console.log("Error while connecting database :- " + err);
        res.send(err);
    } else {
        console.log("Connected to DataBase");
    }
});

module.exports = sql;