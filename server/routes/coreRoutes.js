const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');

// Test Route
router.get('/', (req, res) => res.status(200).json({ message: 'Core API is running' }));

// Users Routes
router.get('/users', coreController.getAllUsers);
router.get('/users/:id', coreController.getUserById);
router.post('/users', coreController.createUser);
router.put('/users/:id', coreController.updateUser);
router.delete('/users/:id', coreController.deleteUser);

// Parking Zones Routes
router.get('/zones', coreController.getAllZones);
router.get('/zones/:id', coreController.getZoneById);
router.post('/zones', coreController.createZone);
router.put('/zones/:id', coreController.updateZone);
router.delete('/zones/:id', coreController.deleteZone);

// Special INNER JOIN Route
router.get('/users/vehicles', coreController.getUsersAndVehicles);

module.exports = router;