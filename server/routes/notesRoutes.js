const express4 = require('express');
const { createNote, getNotes } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');
const routerNotes = express4.Router();

routerNotes.post('/', protect, createNote);
routerNotes.get('/', protect, getNotes);

module.exports = routerNotes;