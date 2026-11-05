const MasterData = require('../models/MasterData');

/* ===============================
   TARIFF_RULES CRUD
================================ */

exports.getAllTariffs = async (req, res) => {
  try {
    const data = await MasterData.findAllTariffs();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.getTariffById = async (req, res) => {
  try {
    const data = await MasterData.findTariffById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Tariff not found' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.createTariff = async (req, res) => {
  try {
    const newTariffId = await MasterData.createTariff(req.body);
    res.status(201).json({ success: true, tariffId: newTariffId });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.updateTariff = async (req, res) => {
  try {
    const affectedRows = await MasterData.updateTariff(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Tariff not found' });
    res.status(200).json({ success: true, message: 'Tariff updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.deleteTariff = async (req, res) => {
  try {
    const affectedRows = await MasterData.deleteTariff(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Tariff not found' });
    res.status(200).json({ success: true, message: 'Tariff deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/* ===============================
   PROMO_CODES CRUD
================================ */

exports.getAllPromos = async (req, res) => {
  try {
    const data = await MasterData.findAllPromos();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.getPromoById = async (req, res) => {
  try {
    const data = await MasterData.findPromoById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.createPromo = async (req, res) => {
  try {
    const newPromoId = await MasterData.createPromo(req.body);
    res.status(201).json({ success: true, promoId: newPromoId });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.updatePromo = async (req, res) => {
  try {
    const affectedRows = await MasterData.updatePromo(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.status(200).json({ success: true, message: 'Promo updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.deletePromo = async (req, res) => {
  try {
    const affectedRows = await MasterData.deletePromo(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.status(200).json({ success: true, message: 'Promo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/* ===============================
   VEHICLES CRUD
================================ */

exports.getAllVehicles = async (req, res) => {
  try {
    const data = await MasterData.findAllVehicles();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const data = await MasterData.findVehicleById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const newVehicleId = await MasterData.createVehicle(req.body);
    res.status(201).json({ success: true, vehicleId: newVehicleId });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const affectedRows = await MasterData.updateVehicle(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid input', error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const affectedRows = await MasterData.deleteVehicle(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/* ===============================
   LEFT JOIN - Vehicles + RFID_Tags
================================ */

exports.getVehiclesWithRFID = async (req, res) => {
  try {
    const data = await MasterData.getVehiclesWithRFID();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};
