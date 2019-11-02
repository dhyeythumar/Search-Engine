const mysql = require('mysql2');

// Pool is created so we do not have to create a new connection for ever query [it automatically handles all the connections].
const db_details = {
    host: 'localhost',
    user: '--db username here--',
    database: '--db name here',
    password: '--db password here--'
};
const pool = mysql.createPool(db_details);

pool.getConnection((err) => {
    if (!err) {
        console.log("DB connected");
    }
    else {
        console.log("DB connection failed");
    }
});

// Promise is used for asynchronous callbacks. And promise handles all the connections made to the database such as releasing the connection.
module.exports = pool.promise();