const db = require('../config/db');

class MasterData {

  /* ===============================
     TARIFF_RULES CRUD
  ================================= */

  static async findAllTariffs() {
    const [rows] = await db.execute('SELECT * FROM Tariff_Rules');
    return rows;
  }

  static async findTariffById(id) {
    const [rows] = await db.execute('SELECT * FROM Tariff_Rules WHERE tariff_id = ?', [id]);
    return rows[0];
  }

  static async createTariff(tariffData) {
    const { vehicle_type, base_rate, hourly_rate, daily_cap } = tariffData;
    const [result] = await db.execute(
      'INSERT INTO Tariff_Rules (vehicle_type, base_rate, hourly_rate, daily_cap) VALUES (?, ?, ?, ?)',
      [vehicle_type, base_rate, hourly_rate, daily_cap]
    );
    return result.insertId;
  }

  static async updateTariff(id, tariffData) {
    const { vehicle_type, base_rate, hourly_rate, daily_cap } = tariffData;
    const [result] = await db.execute(
      'UPDATE Tariff_Rules SET vehicle_type = ?, base_rate = ?, hourly_rate = ?, daily_cap = ? WHERE tariff_id = ?',
      [vehicle_type, base_rate, hourly_rate, daily_cap, id]
    );
    return result.affectedRows;
  }

  static async deleteTariff(id) {
    const [result] = await db.execute('DELETE FROM Tariff_Rules WHERE tariff_id = ?', [id]);
    return result.affectedRows;
  }

  /* ===============================
     PROMO_CODES CRUD
  ================================= */

  static async findAllPromos() {
    const [rows] = await db.execute('SELECT * FROM Promo_Codes');
    return rows;
  }

  static async findPromoById(id) {
    const [rows] = await db.execute('SELECT * FROM Promo_Codes WHERE promo_id = ?', [id]);
    return rows[0];
  }

  static async createPromo(promoData) {
    const { code, discount_type, discount_value, is_active, expiry_date } = promoData;
    const [result] = await db.execute(
      'INSERT INTO Promo_Codes (code, discount_type, discount_value, is_active, expiry_date) VALUES (?, ?, ?, ?, ?)',
      [code, discount_type, discount_value, is_active, expiry_date]
    );
    return result.insertId;
  }

  static async updatePromo(id, promoData) {
    const { code, discount_type, discount_value, is_active, expiry_date } = promoData;
    const [result] = await db.execute(
      'UPDATE Promo_Codes SET code = ?, discount_type = ?, discount_value = ?, is_active = ?, expiry_date = ? WHERE promo_id = ?',
      [code, discount_type, discount_value, is_active, expiry_date, id]
    );
    return result.affectedRows;
  }

  static async deletePromo(id) {
    const [result] = await db.execute('DELETE FROM Promo_Codes WHERE promo_id = ?', [id]);
    return result.affectedRows;
  }

  /* ===============================
     VEHICLES CRUD
  ================================= */

  static async findAllVehicles() {
    const [rows] = await db.execute('SELECT * FROM Vehicles');
    return rows;
  }

  static async findVehicleById(id) {
    const [rows] = await db.execute('SELECT * FROM Vehicles WHERE vehicle_id = ?', [id]);
    return rows[0];
  }

  static async createVehicle(vehicleData) {
    const { user_id, license_plate, vehicle_type, color } = vehicleData;
    const [result] = await db.execute(
      'INSERT INTO Vehicles (user_id, license_plate, vehicle_type, color) VALUES (?, ?, ?, ?)',
      [user_id, license_plate, vehicle_type, color]
    );
    return result.insertId;
  }

  static async updateVehicle(id, vehicleData) {
    const { user_id, license_plate, vehicle_type, color } = vehicleData;
    const [result] = await db.execute(
      'UPDATE Vehicles SET user_id = ?, license_plate = ?, vehicle_type = ?, color = ? WHERE vehicle_id = ?',
      [user_id, license_plate, vehicle_type, color, id]
    );
    return result.affectedRows;
  }

  static async deleteVehicle(id) {
    const [result] = await db.execute('DELETE FROM Vehicles WHERE vehicle_id = ?', [id]);
    return result.affectedRows;
  }

  /* ===============================
     REQUIRED JOIN REPORT
     Vehicles LEFT JOIN RFID_Tags
  ================================= */

  static async getVehiclesWithRFID() {
    const [rows] = await db.execute(`
      SELECT v.vehicle_id, v.license_plate, v.vehicle_type, v.color, v.user_id,
             r.tag_id, r.tag_code, r.status AS rfid_status
      FROM Vehicles v
      LEFT JOIN RFID_Tags r ON v.vehicle_id = r.vehicle_id
    `);
    return rows;
  }

}

module.exports = MasterData;
