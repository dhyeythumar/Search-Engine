const express = require('express');
const authController = require('../controllers/auth.js');

const router = express.Router();

router.post('/user-sign_up', authController.postSignup);

router.post('/user-sign_in', authController.postSignin);

router.post('/edit-user', authController.postEditUser);

module.exports = router;