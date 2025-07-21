import { Response } from 'express';
import Subject from '../models/Subject';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { department, isActive = true } = req.query;
    
    const filter: any = {};
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const subjects = await Subject.find(filter)
      .populate('prerequisites', 'name code')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: subjects,
      count: subjects.length
    });
  } catch (error: any) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Private
export const getSubjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('prerequisites', 'name code description');

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error: any) {
    console.error('Get subject by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Admin)
export const createSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, description, credits, department, prerequisites } = req.body;

    // Check if subject with same code already exists
    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      res.status(400).json({
        success: false,
        message: 'Subject with this code already exists'
      });
      return;
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      description,
      credits,
      department,
      prerequisites: prerequisites || []
    });

    const populatedSubject = await Subject.findById(subject._id)
      .populate('prerequisites', 'name code');

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: populatedSubject
    });
  } catch (error: any) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
export const updateSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, description, credits, department, prerequisites, isActive } = req.body;

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // Check for duplicate code if code is being updated
    if (code && code.toUpperCase() !== subject.code) {
      const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
      if (existingSubject) {
        res.status(400).json({
          success: false,
          message: 'Subject with this code already exists'
        });
        return;
      }
    }

    // Update fields
    if (name) subject.name = name;
    if (code) subject.code = code.toUpperCase();
    if (description !== undefined) subject.description = description;
    if (credits) subject.credits = credits;
    if (department !== undefined) subject.department = department;
    if (prerequisites) subject.prerequisites = prerequisites;
    if (isActive !== undefined) subject.isActive = isActive;

    await subject.save();

    const updatedSubject = await Subject.findById(subject._id)
      .populate('prerequisites', 'name code');

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });
  } catch (error: any) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // TODO: Check if subject is being used in classes, assignments, etc.
    // For now, we'll allow deletion

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};