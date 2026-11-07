const Hardware = require('../models/Hardware');

class HardwareController {
  // 1. RFID CRUD
  static async getAllRFID(req, res) {
    try {
      const data = await Hardware.findAllRFID();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createRFID(req, res) {
    try {
      const insertId = await Hardware.createRFID(req.body);
      res.json({ success: true, message: 'RFID created', id: insertId });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateRFID(req, res) {
    try {
      const affected = await Hardware.updateRFID(req.params.id, req.body);
      res.json({ success: true, affected });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteRFID(req, res) {
    try {
      const affected = await Hardware.deleteRFID(req.params.id);
      res.json({ success: true, affected });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. IoT HEARTBEAT
  static async updateHeartbeat(req, res) {
    try {
      const affected = await Hardware.updateHeartbeat(req.body.device_id);
      res.json({ success: true, message: 'Heartbeat updated', affected });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getAllDevices(req, res) {
    try {
      const data = await Hardware.findAllDevices();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. REQUIRED JOIN REPORT
  static async getChargersWithSpots(req, res) {
    try {
      const data = await Hardware.getChargersWithSpots();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = HardwareController;