const Room = require('../model/room');

// Get all rooms
exports.getAllRooms = (req, res) => {
    Room.getAll((err, roomList) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(roomList);
    });
};

// Get a room by roomNumber
exports.getRoomByNumber = (req, res) => {
    const { roomNumber } = req.params;
    Room.getByRoomNumber(roomNumber, (err, room) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    });
};

// Add a new room
exports.addRoom = (req, res) => {
    const roomData = req.body;

    Room.create(roomData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create room', details: err });
        }
        res.status(201).json({ message: 'Room added successfully', data: result });
    });
};

// Update a room
exports.updateRoom = (req, res) => {
    const { roomNumber } = req.params;
    const updatedData = req.body;

    Room.update(roomNumber, updatedData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Room updated successfully', data: result });
    });
};

// Delete a room
exports.deleteRoom = (req, res) => {
    const { roomNumber } = req.params;

    Room.delete(roomNumber, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    });
};
