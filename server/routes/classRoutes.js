const express3 = require('express');
const { createClass, getClasses } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');
const routerClass = express3.Router();

routerClass.post('/', protect, createClass);
routerClass.get('/', protect, getClasses);

module.exports = routerClass;