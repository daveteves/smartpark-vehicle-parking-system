
const db = require('../config/db');

class Transactions {

    static async findAllReservations() {
        const [rows] = await db.execute('SELECT * FROM Reservations');
        return rows;
    }

    static async findReservationById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Reservations WHERE reservation_id = ?',
            [id]
        );
        return rows[0];
    }

    static async checkReservationOverlap(spot_id, start_time, end_time, excludeId = null) {
        let sql = `
            SELECT reservation_id FROM Reservations
            WHERE spot_id = ?
            AND status IN ('Pending', 'Active')
            AND start_time < ?
            AND end_time > ?
        `;

        const values = [spot_id, end_time, start_time];

        if (excludeId !== null) {
            sql += ' AND reservation_id != ?';
            values.push(excludeId);
        }

        const [rows] = await db.execute(sql, values);
        return rows.length > 0;
    }

    static async createReservation(reservationData) {
        const { user_id, spot_id, start_time, end_time, status } = reservationData;

        const [result] = await db.execute(
            'INSERT INTO Reservations (user_id, spot_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, spot_id, start_time, end_time, status || 'Pending']
        );

        return result.insertId;
    }

    static async updateReservation(id, reservationData) {
        const { user_id, spot_id, start_time, end_time, status } = reservationData;

        const [result] = await db.execute(
            'UPDATE Reservations SET user_id = ?, spot_id = ?, start_time = ?, end_time = ?, status = ? WHERE reservation_id = ?',
            [user_id, spot_id, start_time, end_time, status, id]
        );

        return result.affectedRows;
    }

    static async deleteReservation(id) {
        const [result] = await db.execute(
            'DELETE FROM Reservations WHERE reservation_id = ?',
            [id]
        );

        return result.affectedRows;
    }

    static async findAllSessions() {
        const [rows] = await db.execute('SELECT * FROM Parking_Sessions');
        return rows;
    }

    static async findSessionById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Parking_Sessions WHERE session_id = ?',
            [id]
        );

        return rows[0];
    }

    static async createSession(sessionData) {
        const { vehicle_id, spot_id, entry_timestamp } = sessionData;

        const [result] = await db.execute(
            'INSERT INTO Parking_Sessions (vehicle_id, spot_id, entry_timestamp) VALUES (?, ?, ?)',
            [vehicle_id, spot_id, entry_timestamp]
        );

        return result.insertId;
    }

    static async recordExit(id, exit_timestamp) {
        const [result] = await db.execute(
            "UPDATE Parking_Sessions SET exit_timestamp = ?, status = 'Completed' WHERE session_id = ? AND status = 'Active'",
            [exit_timestamp, id]
        );

        return result.affectedRows;
    }

    static async updateSession(id, sessionData) {
        const { vehicle_id, spot_id, entry_timestamp, exit_timestamp, status } = sessionData;

        const [result] = await db.execute(
            'UPDATE Parking_Sessions SET vehicle_id = ?, spot_id = ?, entry_timestamp = ?, exit_timestamp = ?, status = ? WHERE session_id = ?',
            [vehicle_id, spot_id, entry_timestamp, exit_timestamp, status, id]
        );

        return result.affectedRows;
    }

    static async deleteSession(id) {
        const [result] = await db.execute(
            'DELETE FROM Parking_Sessions WHERE session_id = ?',
            [id]
        );

        return result.affectedRows;
    }

    static async getSessionsWithSpots() {
        const [rows] = await db.execute(
            `SELECT ps.session_id, ps.vehicle_id, ps.spot_id, ps.entry_timestamp, ps.exit_timestamp, ps.status, sp.
            *FROM Parking_Sessions ps
            INNER JOIN Parking_Spots sp
            ON ps.spot_id = sp.spot_id`);

        return rows;
    }
}

module.exports = Transactions;
