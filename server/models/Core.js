const db = require('../config/db');

class Core {
    /*
    ==========================================
     USERS (Registration & Auth Flow)
    ==========================================
    */
    static async findAllUsers() {
        const [rows] = await db.execute('SELECT user_id, first_name, last_name, email, role, created_at FROM Users');
        return rows;
    }

    static async findUserById(id) {
        const [rows] = await db.execute('SELECT user_id, first_name, last_name, email, role, created_at FROM Users WHERE user_id = ?', [id]);
        return rows[0];
    }

    static async findUserByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    }

    static async createUser(userData) {
        const { first_name, last_name, email, password_hash, role } = userData;
        const [result] = await db.execute(
            'INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, role]
        );
        return result.insertId;
    }

    static async updateUser(id, userData) {
        const { first_name, last_name, email, role } = userData;
        const [result] = await db.execute(
            'UPDATE Users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE user_id = ?',
            [first_name, last_name, email, role, id]
        );
        return result.affectedRows;
    }

    static async deleteUser(id) {
        const [result] = await db.execute('DELETE FROM Users WHERE user_id = ?', [id]);
        return result.affectedRows;
    }

    /*
    ==========================================
    PARKING ZONES (Zone Management CRUD)
    ==========================================
    */
    static async findAllZones() {
        const [rows] = await db.execute('SELECT * FROM Parking_Zones');
        return rows;
    }

    static async findZoneById(id) {
        const [rows] = await db.execute('SELECT * FROM Parking_Zones WHERE zone_id = ?', [id]);
        return rows[0];
    }

    static async createZone(zoneData) {
        const { zone_name, floor_level, capacity, zone_type } = zoneData;
        const [result] = await db.execute(
            'INSERT INTO Parking_Zones (zone_name, floor_level, capacity, zone_type) VALUES (?, ?, ?, ?)',
            [zone_name, floor_level, capacity, zone_type]
        );
        return result.insertId;
    }

    static async updateZone(id, zoneData) {
        const { zone_name, floor_level, capacity, zone_type } = zoneData;
        const [result] = await db.execute(
            'UPDATE Parking_Zones SET zone_name = ?, floor_level = ?, capacity = ?, zone_type = ? WHERE zone_id = ?',
            [zone_name, floor_level, capacity, zone_type, id]
        );
        return result.affectedRows;
    }

    static async deleteZone(id) {
        const [result] = await db.execute('DELETE FROM Parking_Zones WHERE zone_id = ?', [id]);
        return result.affectedRows;
    }

    /*
    ==========================================
    REQUIRED JOIN REPORT
    ==========================================
    */
    static async getUsersWithVehicles() {
        const [rows] = await db.execute(`
            SELECT u.first_name, u.last_name, u.email, v.license_plate, v.vehicle_type, v.color 
            FROM Users u
            INNER JOIN Vehicles v ON u.user_id = v.user_id
        `);
        return rows;
    }
}

module.exports = Core;