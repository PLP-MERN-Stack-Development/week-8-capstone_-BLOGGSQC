import Class from '../models/Class.js';
import Student from '../models/Student.js';

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private/Admin/Teacher
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'firstName lastName')
      .populate('subjects', 'name code')
      .sort({ grade: 1, section: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
export const getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('classTeacher', 'firstName lastName email phone')
      .populate('subjects', 'name code description')
      .populate('students', 'user studentId rollNumber');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create class
// @route   POST /api/classes
// @access  Private/Admin
export const createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);

    const populatedClass = await Class.findById(classData._id)
      .populate('classTeacher', 'firstName lastName')
      .populate('subjects', 'name code');

    res.status(201).json({
      success: true,
      data: populatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create class',
      error: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
export const updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('classTeacher', 'firstName lastName')
     .populate('subjects', 'name code');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update class',
      error: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
export const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    await classData.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get class students
// @route   GET /api/classes/:id/students
// @access  Private
export const getClassStudents = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.id })
      .populate('user', 'firstName lastName email phone')
      .sort({ rollNumber: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get class timetable
// @route   GET /api/classes/:id/timetable
// @access  Private
export const getClassTimetable = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('timetable.periods.subject', 'name code')
      .populate('timetable.periods.teacher', 'firstName lastName');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData.timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};