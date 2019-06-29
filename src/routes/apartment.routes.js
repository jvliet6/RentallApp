// The downloaded libraries and connections to other classes.
const express               = require('express');
const router                = express.Router();
const apartmentController   = require('../controller/apartment.controller');
const authController        = require('../controller/authentication.controller');

router.post('/apartments', authController.validateToken, apartmentController.createApartment);
router.get('/apartments', apartmentController.getAllApartments);
router.get('/apartments/:id', apartmentController.getApartmentById);
router.put('/apartments/:id', authController.validateToken, apartmentController.updateApartmentById);
router.delete('/apartments/:id', authController.validateToken, apartmentController.deleteApartmentById);

module.exports = router;
