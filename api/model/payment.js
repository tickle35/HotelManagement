const db = require('../config/db'); // Import the database connection pool

const Payment = {

    // Method to get all rooms
    getAll: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM payment', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },


};

module.exports = Payment;
