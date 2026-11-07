const express = require('express');
const router = express.Router();
const HardwareController = require('../controllers/hardwareController');

// 1. RFID ROUTES - CRUD
router.get('/rfid', HardwareController.getAllRFID);
router.post('/rfid', HardwareController.createRFID);
router.put('/rfid/:id', HardwareController.updateRFID);
router.delete('/rfid/:id', HardwareController.deleteRFID);

// 2. IOT DEVICE ROUTES
router.post('/device/heartbeat', HardwareController.updateHeartbeat);
router.get('/devices', HardwareController.getAllDevices);

// 3. REQUIRED JOIN REPORT
router.get('/chargers-with-spots', HardwareController.getChargersWithSpots);

module.exports = router;