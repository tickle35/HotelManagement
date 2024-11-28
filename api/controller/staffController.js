const Staff = require('../model/staff');

// Get all staff
exports.getAllStaff = (req, res) => {
    Staff.getAll((err, staffList) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(staffList);
    });
};

// Get staff by ID
exports.getStaffById = (req, res) => {
    const { staffId } = req.params;
    Staff.getById(staffId, (err, staff) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(200).json(staff);
    });
};

exports.addStaff = (req, res) => {
    const staffData = req.body;
    console.log('[addStaff] Incoming request payload:', staffData); // Log the payload

    Staff.create(staffData, (err, result) => {
        if (err) {
            console.error('[addStaff] Error while creating staff:', err); // Log any errors
            return res.status(500).json({ error: 'Failed to create staff', details: err });
        }

        console.log('[addStaff] Staff created successfully:', result); // Log success
        res.status(201).json({ message: 'Staff added successfully', data: result });
    });
};

// Update a staff
exports.updateStaff = (req, res) => {
    const { staffId } = req.params;
    const updatedData = req.body;
    Staff.update(staffId, updatedData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Staff updated successfully', data: result });
    });
};

// Delete a staff
exports.deleteStaff = (req, res) => {
    const { staffId } = req.params;
    Staff.delete(staffId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Staff deleted successfully' });
    });
};

// Staff login controller
exports.staffLogin = (req, res) => {
    const { StaffId, password } = req.body;

    if (!StaffId || !password) {
        return res.status(400).json({ error: 'StaffId and password are required.' });
    }

    // Authenticate the staff
    Staff.authenticate(StaffId, password, (err, staff) => {
        console.log(StaffId,'this id is attempting to log in ');
        if (err) {
            return res.status(500).json({ error: 'An error occurred during login.' });
        }

        if (!staff) {
            return res.status(401).json({ error: 'Invalid StaffId or password.' });
        }

        // Send staff details to the frontend
        res.status(200).json({
            message: 'Login successful.',
            staff
        });
    });
};