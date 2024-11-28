const mysql = require('mysql2');

// Create a connection pool for better scalability
const pool = mysql.createPool({
    connectionLimit: 10, // Limit the number of connections
    host: 'localhost',
    user: 'root',  // Replace with your database username
    password: 'emma1234',  // Replace with your database password
    database: 'hotel'  // Database name
});

// Function to get a connection from the pool
function getConnection() {
    console.log('[DB] Attempting to get a connection...');
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('[DB] Connection error:', err); // Log connection errors
                reject(err);
            } else {
                console.log('[DB] Connection acquired successfully.'); // Log success
                resolve(connection);
            }
        });
    });
}


module.exports = { getConnection };
