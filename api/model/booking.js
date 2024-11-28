const db = require('../config/db'); // Import the database connection pool
const { v4: uuidv4 } = require('uuid');

const Booking = {
    // Method to get all bookings
    getAll: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query('SELECT * FROM bookings ORDER BY checkInDate DESC', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch((err) => callback(err));
    },

    // Method to create a new booking
    create: (bookingData, callback) => {
        const { roomNumber, guestId, amount, paymentMethod ,StaffId} = bookingData;
        // const staffId = bookingData.staffId; // Assuming staffId is passed in the data
        const bookingId = uuidv4();
        const checkInDate = new Date().toISOString().split('T')[0];

        db.getConnection()
            .then((connection) => {
                // Change room status to occupied
                connection.query('UPDATE rooms SET status = "occupied" WHERE roomNumber = ?', [roomNumber], (err) => {
                    if (err) {
                        connection.release();
                        return callback(err);
                    }

                    // Insert into bookings table
                    connection.query(
                        `INSERT INTO bookings (BookingId, Status, GuestId, StaffId, roomNumber, checkInDate)
                        VALUES (?, 'checked_in', ?, ?, ?, ?)`,
                        [bookingId, guestId, StaffId, roomNumber, checkInDate],
                        (err, results) => {
                            if (err) {
                                connection.release();
                                return callback(err);
                            }

                            // Insert into payments table
                            // const paymentId = uuidv4();
                            connection.query(
                                `INSERT INTO payment ( amount, paymentMethod, StaffId, itemId)
                                VALUES ( ?, ?, ?, ?)`,
                                [ amount, paymentMethod, StaffId, bookingId],
                                (err) => {
                                    connection.release();
                                    if (err) {
                                        return callback(err);
                                    }
                                    callback(null, { message: 'Booking created successfully' });
                                }
                            );
                        }
                    );
                });
            })
            .catch((err) => callback(err));
    },

    // Method to check out a booking
    checkout: (bookingData, callback) => {
        const { bookingId, roomNumber } = bookingData;
        const checkOutDate = new Date().toISOString().split('T')[0];

        db.getConnection()
            .then((connection) => {
                // Update booking with check-out date
                connection.query(
                    `UPDATE bookings
                    SET checkOutDate = ?, Status = 'checked_out'
                    WHERE BookingId = ?`,
                    [checkOutDate, bookingId],
                    (err) => {
                        if (err) {
                            connection.release();
                            return callback(err);
                        }

                        // Update room status to available
                        connection.query(
                            `UPDATE rooms
                            SET status = 'available'
                            WHERE roomNumber = ?`,
                            [roomNumber],
                            (err) => {
                                connection.release();
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, { message: 'Booking checked out successfully' });
                            }
                        );
                    }
                );
            })
            .catch((err) => callback(err));
    }
};

const ServiceRecord = {
    // Method to get all service records
    getAll: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query('SELECT * FROM serviceRecords ORDER BY date DESC', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch((err) => callback(err));
    },

    // Method to create a new service record
    create: (serviceData, callback) => {
        const { guestId, amount, StaffId ,paymentMethod} = serviceData;
        // const staffId = serviceData.staffId; // Assuming staffId is passed in the data
        const recordId = uuidv4();
        const currentDate = new Date().toISOString().split('T')[0];

        db.getConnection()
            .then((connection) => {
                // Insert into service records table
                connection.query(
                    `INSERT INTO serviceRecords (RecordId, amount, date, status, GuestId, StaffId)
                    VALUES (?, ?, ?, 'paid', ?, ?)`,
                    [recordId, amount, currentDate, guestId, StaffId],
                    (err) => {
                        if (err) {
                            connection.release();
                            return callback(err);
                        }

                        // Insert into payments table
                        // const paymentId = uuidv4();
                        connection.query(
                            `INSERT INTO payment (amount, paymentMethod, StaffId, itemId)
                            VALUES (?, ?, ?, ?)`,
                            [ amount, paymentMethod, StaffId, recordId],
                            (err) => {
                                connection.release();
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, { message: 'Service record created successfully' });
                            }
                        );
                    }
                );
            })
            .catch((err) => callback(err));
    }
};

module.exports = { Booking, ServiceRecord };
