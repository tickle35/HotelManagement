const Payment = require('../model/payment');

// Get all rooms
exports.getAllPayments = (req, res) => {
    Payment.getAll((err, paymentList) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(paymentList);
    });
};