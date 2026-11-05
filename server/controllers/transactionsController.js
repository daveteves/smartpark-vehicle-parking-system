const Transactions = require('../models/Transactions');

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Transactions.findAllReservations();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const data = await Transactions.findReservationById(req.params.id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { user_id, spot_id, start_time, end_time, status } = req.body;

        if (!user_id || !spot_id || !start_time || !end_time) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ success: false, message: 'Invalid reservation time' });
        }

        if (status && !['Pending', 'Active', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid reservation status' });
        }

        const hasOverlap = await Transactions.checkReservationOverlap(spot_id, start_time, end_time);

        if (hasOverlap) {
            return res.status(400).json({ success: false, message: 'Parking spot is already reserved for this time' });
        }

        const reservationId = await Transactions.createReservation(req.body);

        res.status(201).json({ success: true, reservationId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const id = req.params.id;
        const { user_id, spot_id, start_time, end_time, status } = req.body;

        if (!user_id || !spot_id || !start_time || !end_time || !status) {
            return res.status(400).json({ success: false, message: 'All fields must be provided' });
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ success: false, message: 'Invalid reservation time' });
        }

        if (!['Pending', 'Active', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid reservation status' });
        }

        const existing = await Transactions.findReservationById(id);

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        if (status === 'Pending' || status === 'Active') {
            const hasOverlap = await Transactions.checkReservationOverlap(spot_id, start_time, end_time, id);

            if (hasOverlap) {
                return res.status(400).json({ success: false, message: 'Parking spot is already reserved for this time' });
            }
        }

        await Transactions.updateReservation(id, req.body);

        res.status(200).json({ success: true, message: 'Reservation updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const affectedRows = await Transactions.deleteReservation(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getAllSessions = async (req, res) => {
    try {
        const data = await Transactions.findAllSessions();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const data = await Transactions.findSessionById(req.params.id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Parking session not found' });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.createSession = async (req, res) => {
    try {
        const { vehicle_id, spot_id, entry_timestamp } = req.body;

        if (!vehicle_id || !spot_id || !entry_timestamp) {
            return res.status(400).json({ success: false, message: 'Required session fields must be provided' });
        }

        if (isNaN(new Date(entry_timestamp).getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid entry timestamp' });
        }

        const sessionId = await Transactions.createSession(req.body);

        res.status(201).json({ success: true, sessionId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.recordExit = async (req, res) => {
    try {
        const { exit_timestamp } = req.body;

        if (!exit_timestamp || isNaN(new Date(exit_timestamp).getTime())) {
            return res.status(400).json({ success: false, message: 'A valid exit timestamp is required' });
        }

        const session = await Transactions.findSessionById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Parking session not found' });
        }

        if (session.status !== 'Active') {
            return res.status(400).json({ success: false, message: 'Parking session is already completed' });
        }

        if (new Date(exit_timestamp) <= new Date(session.entry_timestamp)) {
            return res.status(400).json({ success: false, message: 'Exit time must be later than entry time' });
        }

        await Transactions.recordExit(req.params.id, exit_timestamp);

        res.status(200).json({ success: true, message: 'Vehicle exit recorded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const id = req.params.id;
        const { vehicle_id, spot_id, entry_timestamp, exit_timestamp, status } = req.body;

        if (!vehicle_id || !spot_id || !entry_timestamp || !status) {
            return res.status(400).json({ success: false, message: 'Required session fields must be provided' });
        }

        if (!['Active', 'Completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid session status' });
        }

        if (isNaN(new Date(entry_timestamp).getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid entry timestamp' });
        }

        if (status === 'Completed' && !exit_timestamp) {
            return res.status(400).json({ success: false, message: 'Exit timestamp is required for completed sessions' });
        }

        if (exit_timestamp && new Date(exit_timestamp) <= new Date(entry_timestamp)) {
            return res.status(400).json({ success: false, message: 'Invalid exit timestamp' });
        }

        const existing = await Transactions.findSessionById(id);

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Parking session not found' });
        }

        await Transactions.updateSession(id, req.body);

        res.status(200).json({ success: true, message: 'Parking session updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const affectedRows = await Transactions.deleteSession(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Parking session not found' });
        }

        res.status(200).json({ success: true, message: 'Parking session deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};

exports.getSessionsWithSpots = async (req, res) => {
    try {
        const data = await Transactions.getSessionsWithSpots();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
};