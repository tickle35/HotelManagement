const Guest = require('../model/guest');

// Get all guests
exports.getAllGuests = (req, res) => {
    Guest.getAll((err, guestList) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(guestList);
    });
};

// Get guest by ID
exports.getGuestById = (req, res) => {
    const { guestId } = req.params;
    Guest.getById(guestId, (err, guest) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.status(200).json(guest);
    });
};

// Add a new guest
exports.addGuest = (req, res) => {
    const guestData = req.body;
    console.log('[addGuest] Incoming request payload:', guestData);

    Guest.create(guestData, (err, result) => {
        if (err) {
            console.error('[addGuest] Error while creating guest:', err);
            return res.status(500).json({ error: 'Failed to create guest', details: err });
        }

        console.log('[addGuest] Guest created successfully:', result);
        res.status(201).json({ message: 'Guest added successfully', data: result });
    });
};

// Update a guest
exports.updateGuest = (req, res) => {
    const { guestId } = req.params;
    const updatedData = req.body;
    Guest.update(guestId, updatedData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Guest updated successfully', data: result });
    });
};

// Delete a guest
exports.deleteGuest = (req, res) => {
    const { guestId } = req.params;
    Guest.delete(guestId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Guest deleted successfully' });
    });
};
