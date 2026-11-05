const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactionsController');

router.get('/reservations', TransactionsController.getAllReservations);
router.get('/reservations/:id', TransactionsController.getReservationById);
router.post('/reservations', TransactionsController.createReservation);
router.put('/reservations/:id', TransactionsController.updateReservation);
router.delete('/reservations/:id', TransactionsController.deleteReservation);

router.get('/sessions', TransactionsController.getAllSessions);
router.get('/sessions/:id', TransactionsController.getSessionById);
router.post('/sessions', TransactionsController.createSession);
router.put('/sessions/:id', TransactionsController.updateSession);
router.patch('/sessions/:id/exit', TransactionsController.recordExit);
router.delete('/sessions/:id', TransactionsController.deleteSession);

router.get('/sessions-with-spots', TransactionsController.getSessionsWithSpots);

module.exports = router;