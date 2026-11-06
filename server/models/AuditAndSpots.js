
const db = require('../config/db');

class AuditAndSpots {

    // MEMBERSHIPS
    static async findAllMemberships() {
        const [rows] = await db.execute(
            'SELECT * FROM Memberships'
        );
        return rows;
    }

    static async findMembershipById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Memberships WHERE membership_id = ?',
            [id]
        );
        return rows[0];
    }

    static async createMembership(data) {
        const { user_id, plan_type, start_date, end_date, status } = data;

        const [result] = await db.execute(
            'INSERT INTO Memberships (user_id, plan_type, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, plan_type, start_date, end_date, status || 'Active']
        );

        return result.insertId;
    }

    static async updateMembership(id, data) {
        const { user_id, plan_type, start_date, end_date, status } = data;

        const [result] = await db.execute(
            'UPDATE Memberships SET user_id = ?, plan_type = ?, start_date = ?, end_date = ?, status = ? WHERE membership_id = ?',
            [user_id, plan_type, start_date, end_date, status, id]
        );

        return result.affectedRows;
    }

    static async deleteMembership(id) {
        const [result] = await db.execute(
            'DELETE FROM Memberships WHERE membership_id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // AUDIT LOGS
    static async findAllAuditLogs() {
        const [rows] = await db.execute(
            'SELECT * FROM Audit_Logs ORDER BY timestamp DESC'
        );
        return rows;
    }

    static async findAuditLogById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Audit_Logs WHERE log_id = ?',
            [id]
        );
        return rows[0];
    }

    static async createAuditLog(data) {
        const { user_id, action_type, description, ip_address } = data;

        const [result] = await db.execute(
            'INSERT INTO Audit_Logs (user_id, action_type, description, ip_address) VALUES (?, ?, ?, ?)',
            [user_id || null, action_type, description, ip_address || null]
        );

        return result.insertId;
    }

    static async updateAuditLog(id, data) {
        const { user_id, action_type, description, ip_address } = data;

        const [result] = await db.execute(
            'UPDATE Audit_Logs SET user_id = ?, action_type = ?, description = ?, ip_address = ? WHERE log_id = ?',
            [user_id || null, action_type, description, ip_address || null, id]
        );

        return result.affectedRows;
    }

    static async deleteAuditLog(id) {
        const [result] = await db.execute(
            'DELETE FROM Audit_Logs WHERE log_id = ?',
            [id]
        );
        return result.affectedRows;
    }

    // PARKING SPOTS
    static async findAllParkingSpots() {
        const [rows] = await db.execute(
            'SELECT * FROM Parking_Spots'
        );
        return rows;
    }

    static async findParkingSpotById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Parking_Spots WHERE spot_id = ?',
            [id]
        );
        return rows[0];
    }

    static async createParkingSpot(data) {
        const { zone_id, spot_number, status } = data;

        const [result] = await db.execute(
            'INSERT INTO Parking_Spots (zone_id, spot_number, status) VALUES (?, ?, ?)',
            [zone_id, spot_number, status || 'Available']
        );

        return result.insertId;
    }

    static async updateParkingSpot(id, data) {
        const { zone_id, spot_number, status } = data;

        const [result] = await db.execute(
            'UPDATE Parking_Spots SET zone_id = ?, spot_number = ?, status = ? WHERE spot_id = ?',
            [zone_id, spot_number, status, id]
        );

        return result.affectedRows;
    }

    static async deleteParkingSpot(id) {
        const [result] = await db.execute(
            'DELETE FROM Parking_Spots WHERE spot_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = AuditAndSpots;
