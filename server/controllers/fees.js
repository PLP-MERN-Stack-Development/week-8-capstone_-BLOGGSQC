import Fee from '../models/Fee.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get fees
// @route   GET /api/fees
// @access  Private
export const getFees = async (req, res) => {
  try {
    const { status, type, class: classId, student, search } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (classId) query.class = classId;
    if (student) query.student = student;

    let fees = Fee.find(query)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section')
      .sort({ dueDate: 1 });

    if (search) {
      fees = fees.populate({
        path: 'student',
        populate: {
          path: 'user',
          match: {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } }
            ]
          }
        }
      });
    }

    const result = await fees;

    // Calculate statistics
    const stats = {
      totalCollected: result.reduce((sum, fee) => sum + fee.paidAmount, 0),
      totalPending: result.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0),
      totalOverdue: result.filter(fee => fee.status === 'overdue')
        .reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0),
      collectionRate: result.length > 0 ? 
        Math.round((result.filter(fee => fee.status === 'paid').length / result.length) * 100) : 0
    };

    res.status(200).json({
      success: true,
      count: result.length,
      stats,
      fees: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single fee
// @route   GET /api/fees/:id
// @access  Private
export const getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName email phone'
        }
      })
      .populate('class', 'name grade section');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create fee
// @route   POST /api/fees
// @access  Private/Admin
export const createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);

    const populatedFee = await Fee.findById(fee._id)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section');

    res.status(201).json({
      success: true,
      data: populatedFee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create fee record',
      error: error.message
    });
  }
};

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private/Admin
export const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
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
     .populate('class', 'name grade section');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update fee record',
      error: error.message
    });
  }
};

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private/Admin
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Fee record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Pay fee
// @route   POST /api/fees/:id/pay
// @access  Private/Admin/Student/Parent
export const payFee = async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body;
    
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    // Check if payment amount is valid
    const remainingAmount = fee.amount - fee.paidAmount;
    if (amount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount exceeds remaining balance'
      });
    }

    const payment = {
      amount,
      method,
      transactionId,
      paidAt: new Date(),
      receivedBy: req.user.id
    };

    // Handle receipt upload
    if (req.files && req.files.receipt) {
      const result = await uploadToCloudinary(req.files.receipt, 'receipts');
      payment.receipt = {
        url: result.url,
        publicId: result.publicId
      };
    }

    fee.payments.push(payment);
    fee.paidAmount += amount;

    await fee.save();

    const updatedFee = await Fee.findById(req.params.id)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section');

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: updatedFee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};