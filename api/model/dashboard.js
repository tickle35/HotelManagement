const db = require('../config/db'); // Import the database connection pool

const Dashboard = {
    // Method to get the count of all bookings
    getBookingCount: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT COUNT(*) AS bookingCount FROM bookings', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0].bookingCount);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get counts of available, unavailable, and total rooms
    getRoomCounts: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query(`
                    SELECT 
                        (SELECT COUNT(*) FROM rooms) AS totalRooms,
                        (SELECT COUNT(*) FROM rooms WHERE status = 'available') AS availableRooms,
                        (SELECT COUNT(*) FROM rooms WHERE status = 'occupied') AS unavailableRooms
                `, (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get counts of check-ins and check-outs
    getCheckInOutCount: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query(`
                    SELECT 
                        (SELECT COUNT(*) FROM bookings WHERE status = 'checked_in') AS checkInCount,
                        (SELECT COUNT(*) FROM bookings WHERE status = 'checked_out') AS checkOutCount
                `, (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },
};

module.exports = Dashboard;
