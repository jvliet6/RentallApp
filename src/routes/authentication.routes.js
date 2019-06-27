const express           = require('express');
const router            = express.Router();
const authController    = require('../controller/authentication.controller');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;


