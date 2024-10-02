const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tarun'
});

// connect to the database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;