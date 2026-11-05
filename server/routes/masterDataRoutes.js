const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');

// Test Route
router.get('/', (req, res) => res.status(200).json({ message: 'MasterData API is running' }));

// Tariff_Rules Routes
router.get('/tariffs', masterDataController.getAllTariffs);
router.get('/tariffs/:id', masterDataController.getTariffById);
router.post('/tariffs', masterDataController.createTariff);
router.put('/tariffs/:id', masterDataController.updateTariff);
router.delete('/tariffs/:id', masterDataController.deleteTariff);

// Promo_Codes Routes
router.get('/promos', masterDataController.getAllPromos);
router.get('/promos/:id', masterDataController.getPromoById);
router.post('/promos', masterDataController.createPromo);
router.put('/promos/:id', masterDataController.updatePromo);
router.delete('/promos/:id', masterDataController.deletePromo);

// Special LEFT JOIN Route - MUST BE BEFORE /vehicles/:id
router.get('/vehicles/rfid', masterDataController.getVehiclesWithRFID);

// Vehicles Routes
router.get('/vehicles', masterDataController.getAllVehicles);
router.get('/vehicles/:id', masterDataController.getVehicleById);
router.post('/vehicles', masterDataController.createVehicle);
router.put('/vehicles/:id', masterDataController.updateVehicle);
router.delete('/vehicles/:id', masterDataController.deleteVehicle);

module.exports = router;
