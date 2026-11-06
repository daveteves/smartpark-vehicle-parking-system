
const AuditAndSpots = require('../models/AuditAndSpots');

// MEMBERSHIPS
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await AuditAndSpots.findAllMemberships();
        res.json({ success: true, data: memberships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMembershipById = async (req, res) => {
    try {
        const membership = await AuditAndSpots.findMembershipById(req.params.id);

        if (!membership) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }

        res.json({ success: true, data: membership });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createMembership = async (req, res) => {
    try {
        const { user_id, plan_type, start_date, end_date } = req.body;

        if (!user_id || !plan_type || !start_date || !end_date) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        const id = await AuditAndSpots.createMembership(req.body);
        res.status(201).json({ success: true, data: { membership_id: id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateMembership = async (req, res) => {
    try {
        const affectedRows = await AuditAndSpots.updateMembership(req.params.id, req.body);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }

        res.json({ success: true, message: 'Membership updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteMembership = async (req, res) => {
    try {
        const affectedRows = await AuditAndSpots.deleteMembership(req.params.id);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }

        res.json({ success: true, message: 'Membership deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// AUDIT LOGS
exports.getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditAndSpots.findAllAuditLogs();
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAuditLogById = async (req, res) => {
    try {
        const log = await AuditAndSpots.findAuditLogById(req.params.id);

        if (!log) {
            return res.status(404).json({ success: false, message: 'Audit log not found' });
        }

        res.json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createAuditLog = async (req, res) => {
    try {
        const { action_type, description } = req.body;

        if (!action_type || !description) {
            return res.status(400).json({ success: false, message: 'Action type and description are required' });
        }

        const id = await AuditAndSpots.createAuditLog(req.body);
        res.status(201).json({ success: true, data: { log_id: id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAuditLog = async (req, res) => {
    try {
        const { action_type, description } = req.body;

        if (!action_type || !description) {
            return res.status(400).json({ success: false, message: 'Action type and description are required' });
        }

        const affectedRows = await AuditAndSpots.updateAuditLog(req.params.id, req.body);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Audit log not found' });
        }

        res.json({ success: true, message: 'Audit log updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteAuditLog = async (req, res) => {
    try {
        const affectedRows = await AuditAndSpots.deleteAuditLog(req.params.id);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Audit log not found' });
        }

        res.json({ success: true, message: 'Audit log deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PARKING SPOTS
exports.getAllParkingSpots = async (req, res) => {
    try {
        const spots = await AuditAndSpots.findAllParkingSpots();
        res.json({ success: true, data: spots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getParkingSpotById = async (req, res) => {
    try {
        const spot = await AuditAndSpots.findParkingSpotById(req.params.id);

        if (!spot) {
            return res.status(404).json({ success: false, message: 'Parking spot not found' });
        }

        res.json({ success: true, data: spot });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createParkingSpot = async (req, res) => {
    try {
        const { zone_id, spot_number } = req.body;

        if (!zone_id || !spot_number) {
            return res.status(400).json({ success: false, message: 'Zone ID and spot number are required' });
        }

        const id = await AuditAndSpots.createParkingSpot(req.body);
        res.status(201).json({ success: true, data: { spot_id: id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateParkingSpot = async (req, res) => {
    try {
        const affectedRows = await AuditAndSpots.updateParkingSpot(req.params.id, req.body);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Parking spot not found' });
        }

        res.json({ success: true, message: 'Parking spot updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteParkingSpot = async (req, res) => {
    try {
        const affectedRows = await AuditAndSpots.deleteParkingSpot(req.params.id);

        if (!affectedRows) {
            return res.status(404).json({ success: false, message: 'Parking spot not found' });
        }

        res.json({ success: true, message: 'Parking spot deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
