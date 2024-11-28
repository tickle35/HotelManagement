const { Booking, ServiceRecord } = require('../model/booking'); // Import the Booking and ServiceRecord models

// Fetch all bookings
exports.getBookings = (req, res) => {
    Booking.getAll((err, bookings) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
        res.status(200).json(bookings);
    });
};

// Create a new booking
exports.createBooking = (req, res) => {
    const { roomNumber, guestId, amount, paymentMethod,StaffId } = req.body;
    // const staffId = req.user.StaffId; // Assuming StaffId is stored in `req.user`

    const bookingData = {
        roomNumber,
        guestId,
        amount,
        paymentMethod,
        StaffId
    };

    Booking.create(bookingData, (err, result) => {
        if (err) {
            console.error('Error creating booking:', err);
            return res.status(500).json({ error: 'Error creating booking' });
        }
        res.status(201).json(result);
    });
};

// Checkout a booking
exports.checkoutBooking = (req, res) => {
    const { bookingId, roomNumber } = req.body;

    const bookingData = {
        bookingId,
        roomNumber
    };

    Booking.checkout(bookingData, (err, result) => {
        if (err) {
            console.error('Error checking out booking:', err);
            return res.status(500).json({ error: 'Error checking out booking' });
        }
        res.status(200).json(result);
    });
};

// Fetch all service records
exports.getServiceRecords = (req, res) => {
    ServiceRecord.getAll((err, serviceRecords) => {
        if (err) {
            console.error('Error fetching service records:', err);
            return res.status(500).json({ error: 'Error fetching service records' });
        }
        res.status(200).json(serviceRecords);
    });
};

// Create a new service record
exports.createServiceRecord = (req, res) => {
    const { guestId, amount, paymentMethod,StaffId } = req.body;
    // const staffId = req.user.StaffId; // Assuming StaffId is stored in `req.user`

    const serviceData = {
        guestId,
        StaffId,
        amount,
        paymentMethod
    };

    ServiceRecord.create(serviceData, (err, result) => {
        if (err) {
            console.error('Error creating service record:', err);
            return res.status(500).json({ error: 'Error creating service record' });
        }
        res.status(201).json(result);
    });
};
