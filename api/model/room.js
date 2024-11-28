const db = require('../config/db'); // Import the database connection pool

const Room = {
    // Method to get the next roomNumber
    getNextRoomNumber: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query(
                    'SELECT roomNumber FROM rooms ORDER BY id DESC LIMIT 1',
                    (err, results) => {
                        connection.release();
                        if (err) return callback(err);

                        const lastRoomNumber = results.length > 0 ? results[0].roomNumber : null;
                        let nextRoomNumber = 'ROOM001'; // Default starting number

                        if (lastRoomNumber) {
                            // Extract numeric part and increment
                            const numericPart = parseInt(lastRoomNumber.replace('ROOM', ''), 10) + 1;
                            nextRoomNumber = `ROOM${String(numericPart).padStart(3, '0')}`;
                        }

                        callback(null, nextRoomNumber);
                    }
                );
            })
            .catch((err) => callback(err));
    },

    // Method to get all rooms
    getAll: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM rooms', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get a room by roomNumber
    getByRoomNumber: (roomNumber, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM rooms WHERE roomNumber = ?', [roomNumber], (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },

    // Method to create a new room record with auto-generated roomNumber
    create: (roomData, callback) => {
        Room.getNextRoomNumber((err, nextRoomNumber) => {
            if (err) {
                console.error('[Room.getNextRoomNumber] Error:', err);
                return callback(err);
            }

            const { type, description, status } = roomData;

            db.getConnection()
                .then((connection) => {
                    const query = `
                        INSERT INTO rooms (roomNumber, type, description, status)
                        VALUES (?, ?, ?, ?)
                    `;
                    const params = [nextRoomNumber, type, description, status];

                    connection.query(query, params, (err, results) => {
                        connection.release();

                        if (err) {
                            console.error('[Room.create] Query execution error:', err);
                            return callback(err);
                        }

                        callback(null, { roomNumber: nextRoomNumber, ...roomData, id: results.insertId });
                    });
                })
                .catch((err) => {
                    console.error('[Room.create] Connection error:', err);
                    callback(err);
                });
        });
    },

    // Method to update a room record
    update: (roomNumber, updatedData, callback) => {
        const { type, description, status } = updatedData;
        db.getConnection()
            .then(connection => {
                connection.query(
                    'UPDATE rooms SET type = ?, description = ?, status = ? WHERE roomNumber = ?',
                    [type, description, status, roomNumber],
                    (err, results) => {
                        connection.release();
                        if (err) {
                            return callback(err);
                        }
                        callback(null, results);
                    }
                );
            })
            .catch(err => callback(err));
    },

    // Method to delete a room record
    delete: (roomNumber, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('DELETE FROM rooms WHERE roomNumber = ?', [roomNumber], (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    }
};

module.exports = Room;
