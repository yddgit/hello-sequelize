const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'test',
});
connection.connect();
connection.query('SELECT 1+1 as solution', function(error, results, fields) {
    if(error) throw error;
    console.log("The solution is: ", results[0].solution);
});
connection.end();