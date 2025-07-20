import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
export const getTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (req.query.department) {
      query.department = req.query.department;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const teachers = await Teacher.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('subjects', 'name code')
      .populate('classes', 'name grade section')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      count: teachers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address dateOfBirth')
      .populate('subjects', 'name code description')
      .populate('classes', 'name grade section');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private/Admin
export const createTeacher = async (req, res) => {
  try {
    const { userData, teacherData } = req.body;

    // Create user first
    const user = await User.create({
      ...userData,
      role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      ...teacherData,
      user: user._id
    });

    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('user', 'firstName lastName email phone')
      .populate('subjects', 'name code')
      .populate('classes', 'name grade section');

    res.status(201).json({
      success: true,
      data: populatedTeacher
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create teacher',
      error: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
export const updateTeacher = async (req, res) => {
  try {
    const { userData, teacherData } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Update user data if provided
    if (userData) {
      await User.findByIdAndUpdate(teacher.user, userData, {
        new: true,
        runValidators: true
      });
    }

    // Update teacher data
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      teacherData,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'firstName lastName email phone')
     .populate('subjects', 'name code')
     .populate('classes', 'name grade section');

    res.status(200).json({
      success: true,
      data: updatedTeacher
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update teacher',
      error: error.message
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Delete associated user
    await User.findByIdAndDelete(teacher.user);
    
    // Delete teacher
    await teacher.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get teacher classes
// @route   GET /api/teachers/:id/classes
// @access  Private
export const getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ classTeacher: req.params.id })
      .populate('students', 'user')
      .populate('subjects', 'name code');

    res.status(200).json({
      success: true,
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

// @desc    Get teacher subjects
// @route   GET /api/teachers/:id/subjects
// @access  Private
export const getTeacherSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.params.id })
      .populate('classes', 'name grade section');

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};