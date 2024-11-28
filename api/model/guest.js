const db = require('../config/db'); // Import the database connection pool

const Guest = {
    // Method to get the next GuestId
    getNextGuestId: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query(
                    'SELECT GuestId FROM guests ORDER BY GuestId DESC LIMIT 1',
                    (err, results) => {
                        connection.release();
                        if (err) return callback(err);

                        const lastId = results.length > 0 ? results[0].GuestId : null;
                        let nextId = 'GUEST0001'; // Default starting ID

                        if (lastId) {
                            // Extract numeric part and increment
                            const numericPart = parseInt(lastId.replace('GUEST', ''), 10) + 1;
                            nextId = `GUEST${String(numericPart).padStart(4, '0')}`;
                        }

                        callback(null, nextId);
                    }
                );
            })
            .catch((err) => callback(err));
    },
    // Method to get all guests
    getAll: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM guests', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get guest by ID
    getById: (guestId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM guests WHERE GuestId = ?', [guestId], (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },

    // Method to create a new guest record with auto-generated GuestId
    create: (guestData, callback) => {
        Guest.getNextGuestId((err, nextGuestId) => {
            if (err) {
                console.error('[Guest.getNextGuestId] Error:', err);
                return callback(err);
            }

            const { firstName, lastName, gender, email } = guestData;
            console.log('[Guest.create] Generating SQL query for new guest:', { nextGuestId, ...guestData });

            db.getConnection()
                .then((connection) => {
                    const query = `
                    INSERT INTO guests (GuestId, firstName, lastName, gender, email)
                    VALUES (?, ?, ?, ?, ?)
                `;
                    const params = [nextGuestId, firstName, lastName, gender, email];

                    console.log('[Guest.create] Running query:', query, 'with params:', params);

                    connection.query(query, params, (err, results) => {
                        connection.release();

                        if (err) {
                            console.error('[Guest.create] Query execution error:', err);
                            return callback(err);
                        }

                        console.log('[Guest.create] Query successful, inserted ID:', results.insertId);
                        callback(null, { GuestId: nextGuestId, ...guestData, id: results.insertId });
                    });
                })
                .catch((err) => {
                    console.error('[Guest.create] Connection error:', err);
                    callback(err);
                });
        });
    },
    // Method to update a guest record
    update: (guestId, updatedData, callback) => {
        const { firstName, lastName, gender, email } = updatedData;
        db.getConnection()
            .then(connection => {
                connection.query(
                    'UPDATE guests SET firstName = ?, lastName = ?, gender = ?, email = ? WHERE GuestId = ?',
                    [firstName, lastName, gender, email, guestId],
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

    // Method to delete a guest record
    delete: (guestId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('DELETE FROM guests WHERE GuestId = ?', [guestId], (err, results) => {
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

module.exports = Guest;
