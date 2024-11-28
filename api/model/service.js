const db = require('../config/db'); // Import the database connection pool

const Service = {
    // Method to get the next ServiceId
    getNextServiceId: (callback) => {
        db.getConnection()
            .then((connection) => {
                connection.query(
                    'SELECT ServiceId FROM services ORDER BY ServiceId DESC LIMIT 1',
                    (err, results) => {
                        connection.release();
                        if (err) return callback(err);

                        const lastId = results.length > 0 ? results[0].ServiceId : null;
                        let nextId = 'SERVICE0001'; // Default starting ID

                        if (lastId) {
                            // Extract numeric part and increment
                            const numericPart = parseInt(lastId.replace('SERVICE', ''), 10) + 1;
                            nextId = `SERVICE${String(numericPart).padStart(4, '0')}`;
                        }

                        callback(null, nextId);
                    }
                );
            })
            .catch((err) => callback(err));
    },

    // Method to get all services
    getAll: (callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM services', (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            })
            .catch(err => callback(err));
    },

    // Method to get a service by ID
    getById: (serviceId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('SELECT * FROM services WHERE ServiceId = ?', [serviceId], (err, results) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results[0]);
                });
            })
            .catch(err => callback(err));
    },

    // Method to create a new service record with auto-generated ServiceId
    create: (serviceData, callback) => {
        Service.getNextServiceId((err, nextServiceId) => {
            if (err) {
                console.error('[Service.getNextServiceId] Error:', err);
                return callback(err);
            }

            const { ServiceName, price, inCharge } = serviceData;
            console.log('[Service.create] Generating SQL query for new service:', { nextServiceId, ...serviceData });

            db.getConnection()
                .then((connection) => {
                    const query = `
                    INSERT INTO services (ServiceId, ServiceName, price, inCharge)
                    VALUES (?, ?, ?, ?)
                `;
                    const params = [nextServiceId, ServiceName, price, inCharge];

                    console.log('[Service.create] Running query:', query, 'with params:', params);

                    connection.query(query, params, (err, results) => {
                        connection.release();

                        if (err) {
                            console.error('[Service.create] Query execution error:', err);
                            return callback(err);
                        }

                        console.log('[Service.create] Query successful, inserted ID:', results.insertId);
                        callback(null, { ServiceId: nextServiceId, ...serviceData, id: results.insertId });
                    });
                })
                .catch((err) => {
                    console.error('[Service.create] Connection error:', err);
                    callback(err);
                });
        });
    },

    // Method to update a service record
    update: (serviceId, updatedData, callback) => {
        const { ServiceName, price, inCharge } = updatedData;
        db.getConnection()
            .then(connection => {
                connection.query(
                    'UPDATE services SET ServiceName = ?, price = ?, inCharge = ? WHERE ServiceId = ?',
                    [ServiceName, price, inCharge, serviceId],
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

    // Method to delete a service record
    delete: (serviceId, callback) => {
        db.getConnection()
            .then(connection => {
                connection.query('DELETE FROM services WHERE ServiceId = ?', [serviceId], (err, results) => {
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

module.exports = Service;
