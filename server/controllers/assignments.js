import Assignment from '../models/Assignment.js';
import Grade from '../models/Grade.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
export const getAssignments = async (req, res) => {
  try {
    const query = {};
    
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    
    if (req.query.class) {
      query.class = req.query.class;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const assignments = await Assignment.find(query)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code description')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName email')
      .populate('submissions.student', 'user studentId rollNumber')
      .populate({
        path: 'submissions.student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private/Admin/Teacher
export const createAssignment = async (req, res) => {
  try {
    const assignmentData = {
      ...req.body,
      teacher: req.user.id
    };

    // Handle file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'assignments');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      assignmentData.attachments = uploadedFiles;
    }

    const assignment = await Assignment.create(assignmentData);

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Admin/Teacher
export const updateAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the owner or admin
    if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment'
      });
    }

    // Handle new file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'assignments');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      req.body.attachments = [...(assignment.attachments || []), ...uploadedFiles];
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('subject', 'name code')
     .populate('class', 'name grade section')
     .populate('teacher', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin/Teacher
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the owner or admin
    if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }

    // Delete files from Cloudinary
    if (assignment.attachments && assignment.attachments.length > 0) {
      for (const file of assignment.attachments) {
        if (file.publicId) {
          await deleteFromCloudinary(file.publicId);
        }
      }
    }

    // Delete submission files
    if (assignment.submissions && assignment.submissions.length > 0) {
      for (const submission of assignment.submissions) {
        if (submission.files && submission.files.length > 0) {
          for (const file of submission.files) {
            if (file.publicId) {
              await deleteFromCloudinary(file.publicId);
            }
          }
        }
      }
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
export const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if assignment is still open
    if (assignment.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Assignment is closed for submissions'
      });
    }

    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted'
      });
    }

    const submissionData = {
      student: req.user.id,
      content: req.body.content,
      submittedAt: new Date()
    };

    // Handle file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'submissions');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      submissionData.files = uploadedFiles;
    }

    assignment.submissions.push(submissionData);
    await assignment.save();

    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'user studentId rollNumber')
      .populate({
        path: 'submissions.student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: updatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};

// @desc    Grade submission
// @route   PUT /api/assignments/:id/submissions/:submissionId/grade
// @access  Private/Admin/Teacher
export const gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const submission = assignment.submissions.id(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Update submission grade
    submission.grade = {
      score,
      feedback,
      gradedAt: new Date(),
      gradedBy: req.user.id
    };
    submission.status = 'graded';

    await assignment.save();

    // Create grade record
    await Grade.create({
      student: submission.student,
      subject: assignment.subject,
      class: assignment.class,
      teacher: req.user.id,
      assignment: assignment._id,
      examType: 'assignment',
      title: assignment.title,
      score,
      maxScore: assignment.points,
      term: 'term1', // You might want to make this dynamic
      academicYear: new Date().getFullYear().toString()
    });

    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'user studentId rollNumber')
      .populate({
        path: 'submissions.student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: updatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to grade submission',
      error: error.message
    });
  }
};