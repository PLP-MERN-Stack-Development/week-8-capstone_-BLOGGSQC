const Class = require('../models/Class');

const createClass = async (req, res) => {
  const { name, subjects, teacher } = req.body;
  const newClass = await Class.create({ name, subjects, teacher });
  res.status(201).json(newClass);
};

const getClasses = async (req, res) => {
  const classes = await Class.find().populate('teacher', 'name email');
  res.json(classes);
};

module.exports = { createClass, getClasses };