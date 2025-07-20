import Note from '../models/Note.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const query = {};
    
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    
    if (req.query.class) {
      query.class = req.query.class;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const notes = await Note.find(query)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('subject', 'name code description')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private/Admin/Teacher
export const createNote = async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      teacher: req.user.id
    };

    // Handle file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'notes');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      noteData.files = uploadedFiles;
    }

    const note = await Note.create(noteData);

    const populatedNote = await Note.findById(note._id)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedNote
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private/Admin/Teacher
export const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if user is the owner or admin
    if (note.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    // Handle new file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'notes');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      req.body.files = [...(note.files || []), ...uploadedFiles];
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('subject', 'name code')
     .populate('class', 'name grade section')
     .populate('teacher', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update note',
      error: error.message
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private/Admin/Teacher
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if user is the owner or admin
    if (note.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    // Delete files from Cloudinary
    if (note.files && note.files.length > 0) {
      for (const file of note.files) {
        if (file.publicId) {
          await deleteFromCloudinary(file.publicId);
        }
      }
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};