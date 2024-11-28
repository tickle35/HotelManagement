const db = require('../config/db'); // Import the database connection pool
const bcrypt = require('bcrypt');
const Staff = {
    // Method to get the next StaffId
    getNextStaffId: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query(
                    'SELECT StaffId FROM staff ORDER BY StaffId DESC LIMIT 1',
                    (err, results) => {
                        connection.release();
                        if (err) return callback(err);

                        const lastId = results.length > 0 ? results[0].StaffId : null;
                        let nextId = 'STAFF0001'; // Default starting ID

                        if (lastId) {
                            // Extract numeric part and increment
                            const numericPart = parseInt(lastId.replace('STAFF', ''), 10) + 1;
                            nextId = `STAFF${String(numericPart).padStart(4, '0')}`;
                        }

                        callback(null, nextId);
                    }
                );
            })
            .catch((err) => callback(err));
    },
    // Method to get all staff
    getAll: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM staff', (err, results) => {
                    connection.release(); // Release the connection after the query
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get staff by ID
    getById: (staffId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM staff WHERE StaffId = ?', [staffId], (err, results) => {
                    connection.release(); // Release the connection after the query
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },

    // Method to create a new staff record with auto-generated StaffId
    create: (staffData, callback) => {
        Staff.getNextStaffId((err, nextStaffId) => {
            if (err) {
                console.error('[Staff.getNextStaffId] Error:', err); // Log errors from ID generation
                return callback(err);
            }

            const { name, gender, position, role, email, password } = staffData;

            // Hash the password before storing it
            bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('[Staff.create] Password hashing error:', hashErr); // Log password hashing errors
                    return callback(hashErr);
                }

                console.log('[Staff.create] Generating SQL query for new staff:', { nextStaffId, ...staffData });

                db.getConnection()
                    .then((connection) => {
                        const query = `
                        INSERT INTO staff (StaffId, name, gender, position, role, email, password)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;
                        const params = [
                            nextStaffId,
                            name,
                            gender,
                            position,
                            role,
                            email,
                            hashedPassword, // Use the hashed password here
                        ];

                        console.log('[Staff.create] Running query:', query, 'with params:', params);

                        connection.query(query, params, (err, results) => {
                            connection.release();

                            if (err) {
                                console.error('[Staff.create] Query execution error:', err); // Log query errors
                                return callback(err);
                            }

                            console.log('[Staff.create] Query successful, inserted ID:', results.insertId); // Log success
                            callback(null, { StaffId: nextStaffId, ...staffData, id: results.insertId });
                        });
                    })
                    .catch((err) => {
                        console.error('[Staff.create] Connection error:', err); // Log connection issues
                        callback(err);
                    });
            });
        });
    },

    // Method to update a staff record
    update: (staffId, updatedData, callback) => {
        const { name, gender, position, role, email, password } = updatedData;
        db.getConnection()
            .then(connection => {
                connection.query(
                    'UPDATE staff SET name = ?, gender = ?, position = ?, role = ?, email = ?, password = ? WHERE StaffId = ?',
                    [name, gender, position, role, email, password, staffId],
                    (err, results) => {
                        connection.release(); // Release the connection after the query
                        if (err) {
                            return callback(err);
                        }
                        callback(null, results);
                    }
                );
            })
            .catch(err => callback(err));
    },

    // Method to delete a staff record
    delete: (staffId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('DELETE FROM staff WHERE StaffId = ?', [staffId], (err, results) => {
                    connection.release(); // Release the connection after the query
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },

    // Authenticate staff by StaffId and password
    authenticate: (StaffId, password, callback) => {
        db.getConnection()
            .then((connection) => {
                // Retrieve the staff record by StaffId
                connection.query(
                    'SELECT * FROM staff WHERE StaffId = ?',
                    [StaffId],
                    (err, results) => {
                        connection.release();

                        if (err) {
                            console.error('[Staff.authenticate] Query error:', err);
                            return callback(err);
                        }

                        if (results.length === 0) {
                            return callback(null, null); // No staff found
                        }

                        const staff = results[0];
                        console.log(staff,'this staff was found')

                        // Compare the provided password with the hashed password
                        bcrypt.compare(password, staff.password, (err, isMatch) => {
                            if (err) {
                                console.error('[Staff.authenticate] Password comparison error:', err);
                                return callback(err);
                            }

                            if (!isMatch) {
                                return callback(null, null); // Invalid password
                            }

                            // Password matches, return staff details
                            callback(null, {
                                StaffId: staff.StaffId,
                                FullName: staff.FullName,
                                position: staff.position,
                                department: staff.department,
                                email: staff.email
                                // Add other fields as needed
                            });
                        });
                    }
                );
            })
            .catch((err) => callback(err));
    }
};

module.exports = Staff;
