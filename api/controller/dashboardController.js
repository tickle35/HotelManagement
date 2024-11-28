const Dashboard = require('../model/dashboard');

// Get booking count
exports.getBookingCount = (req, res) => {
    Dashboard.getBookingCount((err, bookingCount) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ bookingCount });
    });
};

// Get room counts
exports.getRoomCounts = (req, res) => {
    Dashboard.getRoomCounts((err, roomCounts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(roomCounts);
    });
};

// Get check-in and check-out counts
exports.getCheckInOutCount = (req, res) => {
    Dashboard.getCheckInOutCount((err, checkInOutCounts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(checkInOutCounts);
    });
};

// Get all dashboard data
exports.getDashboardData = (req, res) => {
    const responseData = {};

    Dashboard.getBookingCount((err, bookingCount) => {
        if (err) return res.status(500).json({ error: err.message });
        responseData.bookingCount = bookingCount;

        Dashboard.getRoomCounts((err, roomCounts) => {
            if (err) return res.status(500).json({ error: err.message });
            responseData.roomCounts = roomCounts;

            Dashboard.getCheckInOutCount((err, checkInOutCounts) => {
                if (err) return res.status(500).json({ error: err.message });
                responseData.checkInOutCounts = checkInOutCounts;

                res.status(200).json(responseData);
            });
        });
    });
};
