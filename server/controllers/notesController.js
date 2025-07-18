const Note = require('../models/Note');

const createNote = async (req, res) => {
  const { title, fileUrl, classId } = req.body;
  const note = await Note.create({ title, fileUrl, classId, uploadedBy: req.user._id });
  res.status(201).json(note);
};

const getNotes = async (req, res) => {
  const notes = await Note.find().populate('uploadedBy', 'name').populate('classId', 'name');
  res.json(notes);
};

module.exports = { createNote, getNotes };