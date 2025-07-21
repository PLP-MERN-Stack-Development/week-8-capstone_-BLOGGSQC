import { Response } from 'express';
import Class from '../models/Class';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
export const getClasses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { academicYear, isActive = true } = req.query;
    
    const filter: any = {};
    if (academicYear) filter.academicYear = academicYear;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const classes = await Class.find(filter)
      .populate('teacher', 'firstName lastName email')
      .populate('subjects', 'name code')
      .populate('students', 'firstName lastName studentId')
      .sort({ name: 1, section: 1 });

    res.json({
      success: true,
      data: classes,
      count: classes.length
    });
  } catch (error: any) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private
export const getClassById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacher', 'firstName lastName email phone')
      .populate('subjects', 'name code description credits')
      .populate('students', 'firstName lastName studentId email rollNumber');

    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found'
      });
      return;
    }

    res.json({
      success: true,
      data: classData
    });
  } catch (error: any) {
    console.error('Get class by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin)
export const createClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, section, teacher, classroom, capacity, academicYear, subjects } = req.body;

    // Check if teacher exists and has teacher role
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'teacher') {
      res.status(400).json({
        success: false,
        message: 'Invalid teacher ID or user is not a teacher'
      });
      return;
    }

    // Check if class with same name, section, and academic year already exists
    const existingClass = await Class.findOne({ name, section, academicYear });
    if (existingClass) {
      res.status(400).json({
        success: false,
        message: 'Class with this name and section already exists for the academic year'
      });
      return;
    }

    const newClass = await Class.create({
      name,
      section,
      teacher,
      classroom,
      capacity,
      academicYear,
      subjects: subjects || [],
      students: []
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate('teacher', 'firstName lastName email')
      .populate('subjects', 'name code');

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: populatedClass
    });
  } catch (error: any) {
    console.error('Create class error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
export const updateClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, section, teacher, classroom, capacity, academicYear, subjects, isActive } = req.body;

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found'
      });
      return;
    }

    // If teacher is being updated, validate it
    if (teacher) {
      const teacherUser = await User.findById(teacher);
      if (!teacherUser || teacherUser.role !== 'teacher') {
        res.status(400).json({
          success: false,
          message: 'Invalid teacher ID or user is not a teacher'
        });
        return;
      }
    }

    // Check for duplicate class if name, section, or academic year is being updated
    if (name || section || academicYear) {
      const checkName = name || classData.name;
      const checkSection = section || classData.section;
      const checkAcademicYear = academicYear || classData.academicYear;

      const existingClass = await Class.findOne({
        _id: { $ne: req.params.id },
        name: checkName,
        section: checkSection,
        academicYear: checkAcademicYear
      });

      if (existingClass) {
        res.status(400).json({
          success: false,
          message: 'Class with this name and section already exists for the academic year'
        });
        return;
      }
    }

    // Update fields
    if (name) classData.name = name;
    if (section) classData.section = section;
    if (teacher) classData.teacher = teacher;
    if (classroom) classData.classroom = classroom;
    if (capacity) classData.capacity = capacity;
    if (academicYear) classData.academicYear = academicYear;
    if (subjects) classData.subjects = subjects;
    if (isActive !== undefined) classData.isActive = isActive;

    await classData.save();

    const updatedClass = await Class.findById(classData._id)
      .populate('teacher', 'firstName lastName email')
      .populate('subjects', 'name code')
      .populate('students', 'firstName lastName studentId');

    res.json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error: any) {
    console.error('Update class error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
export const deleteClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found'
      });
      return;
    }

    // Check if class has students
    if (classData.students && classData.students.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete class with enrolled students. Please transfer students first.'
      });
      return;
    }

    await Class.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete class error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};