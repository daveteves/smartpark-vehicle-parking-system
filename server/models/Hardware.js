const db = require('../config/db');

class Hardware {
  /* =============================== RFIDTag CRUD ================================= */
  static async findAllRFID() {
    const [rows] = await db.execute('SELECT * FROM RFID_Tags');
    return rows;
  }

  static async findRFIDById(rfid_uid) {
    const [rows] = await db.execute('SELECT * FROM RFID_Tags WHERE rfid_uid = ?', [rfid_uid]);
    return rows[0];
  }

  static async createRFID(rfidData) {
    const { rfid_uid, user_id, vehicle_plate, status } = rfidData;
    const [result] = await db.execute(
     'INSERT INTO RFID_Tags (rfid_uid, user_id, vehicle_plate, status) VALUES (?, ?, ?, ?)',
[rfid_uid, user_id, vehicle_plate, status]
    );
    return result.insertId;
  }

  static async updateRFID(rfid_uid, rfidData) {
    const { user_id, vehicle_plate, status } = rfidData;
    const [result] = await db.execute(
      'UPDATE RFID_Tags SET user_id = ?, vehicle_plate = ?, status = ? WHERE rfid_uid = ?',
      [user_id, vehicle_plate, status, rfid_uid]
    );
    return result.affectedRows;
  }

  static async deleteRFID(rfid_uid) {
    const [result] = await db.execute('DELETE FROM RFID_Tags WHERE rfid_uid = ?', [rfid_uid]);
    return result.affectedRows;
  }

  /* =============================== IoTDevice HEARTBEAT ================================= */
  static async updateHeartbeat(device_id) {
    const [result] = await db.execute(
      'UPDATE IoT_Devices SET last_heartbeat = NOW(), status = "online" WHERE device_id = ?',
      [device_id]
    );
    return result.affectedRows;
  }

  static async findAllDevices() {
    const [rows] = await db.execute('SELECT * FROM IoT_Devices');
    return rows;
  }

  /* =============================== REQUIRED JOIN REPORT EV_Chargers LEFT JOIN Spots ================================= */
  static async getChargersWithSpots() {
    const [rows] = await db.execute(`
      SELECT c.charger_id, c.spot_id, c.charger_type, c.power_output_kw, c.status AS charger_status, 
            s.spot_number, s.status AS spot_status
     FROM EV_Chargers c
      LEFT JOIN Parking_Spots s ON c.spot_id = s.spot_id
    `);
    return rows;
  }
}

module.exports = Hardware;