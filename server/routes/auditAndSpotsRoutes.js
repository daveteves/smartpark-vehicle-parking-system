
const express = require('express');
const router = express.Router();
const AuditAndSpotsController = require('../controllers/auditAndSpotsController');

// MEMBERSHIPS
router.get('/memberships', AuditAndSpotsController.getAllMemberships);
router.get('/memberships/:id', AuditAndSpotsController.getMembershipById);
router.post('/memberships', AuditAndSpotsController.createMembership);
router.put('/memberships/:id', AuditAndSpotsController.updateMembership);
router.delete('/memberships/:id', AuditAndSpotsController.deleteMembership);

// AUDIT LOGS
router.get('/audit-logs', AuditAndSpotsController.getAllAuditLogs);
router.get('/audit-logs/:id', AuditAndSpotsController.getAuditLogById);
router.post('/audit-logs', AuditAndSpotsController.createAuditLog);
router.put('/audit-logs/:id', AuditAndSpotsController.updateAuditLog);
router.delete('/audit-logs/:id', AuditAndSpotsController.deleteAuditLog);

// PARKING SPOTS
router.get('/parking-spots', AuditAndSpotsController.getAllParkingSpots);
router.get('/parking-spots/:id', AuditAndSpotsController.getParkingSpotById);
router.post('/parking-spots', AuditAndSpotsController.createParkingSpot);
router.put('/parking-spots/:id', AuditAndSpotsController.updateParkingSpot);
router.delete('/parking-spots/:id', AuditAndSpotsController.deleteParkingSpot);
router.get('/spots-with-zones', AuditAndSpotsController.getSpotsWithZones);

module.exports = router;
