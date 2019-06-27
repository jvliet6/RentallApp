const express               = require('express');
const router                = express.Router();
const authController        = require('../controller/authentication.controller');
const reservationController = require('../controller/reservation.controller');

router.post('/apartments/:id/reservations', authController.validateToken, reservationController.createReservation);
router.get('/apartments/:id/reservations', authController.validateToken, reservationController.getAllReservations);
router.get('/apartments/reservations/:id', authController.validateToken, reservationController.getReservationById);
router.put('/apartments/:apartmentId/reservations/:reservationId', authController.validateToken, reservationController.updateReservationById);
router.delete('/apartments/reservations/:reservationId', authController.validateToken, reservationController.deleteReservationById);

module.exports = router;