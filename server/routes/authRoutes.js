const express2 = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const routerAuth = express2.Router();

routerAuth.post('/register', registerUser);
routerAuth.post('/login', authUser);

module.exports = routerAuth;