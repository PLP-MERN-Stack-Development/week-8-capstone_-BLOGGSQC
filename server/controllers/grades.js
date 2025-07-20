import Grade from '../models/Grade.js';

// @desc    Get grades
// @route   GET /api/grades
// @access  Private
export const getGrades = async (req, res) => {
  try {
    const { class: classId, subject, student, term, academicYear } = req.query;
    
    const query = {};
    
    if (classId) query.class = classId;
    if (subject) query.subject = subject;
    if (student) query.student = student;
    if (term) query.term = term;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalStudents: new Set(grades.map(g => g.student._id.toString())).size,
      classAverage: grades.length > 0 ? 
        Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) : 0,
      highest: grades.length > 0 ? Math.max(...grades.map(g => g.percentage)) : 0,
      lowest: grades.length > 0 ? Math.min(...grades.map(g => g.percentage)) : 0
    };

    // Grade distribution
    const distribution = [
      { name: 'A (90-100)', value: grades.filter(g => g.percentage >= 90).length },
      { name: 'B (80-89)', value: grades.filter(g => g.percentage >= 80 && g.percentage < 90).length },
      { name: 'C (70-79)', value: grades.filter(g => g.percentage >= 70 && g.percentage < 80).length },
      { name: 'D (60-69)', value: grades.filter(g => g.percentage >= 60 && g.percentage < 70).length },
      { name: 'F (0-59)', value: grades.filter(g => g.percentage < 60).length }
    ];

    // Letter grade distribution
    const letterDistribution = {
      'A': grades.filter(g => g.letterGrade.startsWith('A')).length,
      'B': grades.filter(g => g.letterGrade.startsWith('B')).length,
      'C': grades.filter(g => g.letterGrade.startsWith('C')).length,
      'D': grades.filter(g => g.letterGrade.startsWith('D')).length,
      'F': grades.filter(g => g.letterGrade === 'F').length
    };

    res.status(200).json({
      success: true,
      count: grades.length,
      stats,
      distribution,
      letterDistribution,
      grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create grade
// @route   POST /api/grades
// @access  Private/Admin/Teacher
export const createGrade = async (req, res) => {
  try {
    const gradeData = {
      ...req.body,
      teacher: req.user.id
    };

    const grade = await Grade.create(gradeData);

    const populatedGrade = await Grade.findById(grade._id)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedGrade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create grade',
      error: error.message
    });
  }
};

// @desc    Update grade
// @route   PUT /api/grades/:id
// @access  Private/Admin/Teacher
export const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('student', 'user studentId rollNumber')
     .populate({
       path: 'student',
       populate: {
         path: 'user',
         select: 'firstName lastName'
       }
     })
     .populate('subject', 'name code')
     .populate('class', 'name grade section')
     .populate('teacher', 'firstName lastName');

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update grade',
      error: error.message
    });
  }
};

// @desc    Delete grade
// @route   DELETE /api/grades/:id
// @access  Private/Admin/Teacher
export const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    await grade.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk create grades
// @route   POST /api/grades/bulk
// @access  Private/Admin/Teacher
export const bulkCreateGrades = async (req, res) => {
  try {
    const { grades } = req.body;

    const gradeRecords = grades.map(grade => ({
      ...grade,
      teacher: req.user.id
    }));

    const createdGrades = await Grade.insertMany(gradeRecords);

    const populatedGrades = await Grade.find({
      _id: { $in: createdGrades.map(g => g._id) }
    }).populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Grades created successfully',
      count: populatedGrades.length,
      data: populatedGrades
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create grades',
      error: error.message
    });
  }
};