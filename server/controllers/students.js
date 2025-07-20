import Student from '../models/Student.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Grade from '../models/Grade.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Teacher
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (req.query.class) {
      query.class = req.query.class;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    let students = Student.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('class', 'name grade section')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (req.query.search) {
      students = students.populate({
        path: 'user',
        match: {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      });
    }

    const result = await students;
    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: result.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      students: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address dateOfBirth')
      .populate('class', 'name grade section classTeacher');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { userData, studentData } = req.body;

    // Create user first
    const user = await User.create({
      ...userData,
      role: 'student'
    });

    // Create student profile
    const student = await Student.create({
      ...studentData,
      user: user._id
    });

    const populatedStudent = await Student.findById(student._id)
      .populate('user', 'firstName lastName email phone')
      .populate('class', 'name grade section');

    res.status(201).json({
      success: true,
      data: populatedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin/Teacher
export const updateStudent = async (req, res) => {
  try {
    const { userData, studentData } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update user data if provided
    if (userData) {
      await User.findByIdAndUpdate(student.user, userData, {
        new: true,
        runValidators: true
      });
    }

    // Update student data
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      studentData,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'firstName lastName email phone')
     .populate('class', 'name grade section');

    res.status(200).json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete associated user
    await User.findByIdAndDelete(student.user);
    
    // Delete student
    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private
export const getStudentAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { student: req.params.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student grades
// @route   GET /api/students/:id/grades
// @access  Private
export const getStudentGrades = async (req, res) => {
  try {
    const { term, academicYear } = req.query;
    
    const query = { student: req.params.id };
    
    if (term) query.term = term;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};