const Core = require('../models/Core');

/*
==========================================
USERS CRUD
==========================================
*/
exports.getAllUsers = async (req, res) => {
    try {
        const data = await Core.findAllUsers();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const data = await Core.findUserById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUserId = await Core.createUser(req.body);
        res.status(201).json({ success: true, userId: newUserId });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const affectedRows = await Core.updateUser(req.params.id, req.body);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const affectedRows = await Core.deleteUser(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

/*
==========================================
PARKING ZONES CRUD
==========================================
*/
exports.getAllZones = async (req, res) => {
    try {
        const data = await Core.findAllZones();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getZoneById = async (req, res) => {
    try {
        const data = await Core.findZoneById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Zone not found' });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.createZone = async (req, res) => {
    try {
        const newZoneId = await Core.createZone(req.body);
        res.status(201).json({ success: true, zoneId: newZoneId });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
    }
};

exports.updateZone = async (req, res) => {
    try {
        const affectedRows = await Core.updateZone(req.params.id, req.body);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Zone not found' });
        res.status(200).json({ success: true, message: 'Zone updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
    }
};

exports.deleteZone = async (req, res) => {
    try {
        const affectedRows = await Core.deleteZone(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Zone not found' });
        res.status(200).json({ success: true, message: 'Zone deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};


/*
==========================================
INNER JOIN
==========================================
*/
exports.getUsersAndVehicles = async (req, res) => {
    try {
        const data = await Core.getUsersWithVehicles();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};