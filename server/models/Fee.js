import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  type: {
    type: String,
    enum: ['tuition', 'transport', 'meals', 'activities', 'library', 'lab', 'exam', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  payments: [{
    amount: Number,
    method: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'online', 'cheque']
    },
    transactionId: String,
    paidAt: {
      type: Date,
      default: Date.now
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receipt: {
      url: String,
      publicId: String
    }
  }],
  term: {
    type: String,
    enum: ['term1', 'term2', 'term3', 'annual'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  discount: {
    amount: Number,
    reason: String,
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  lateFee: {
    amount: Number,
    appliedAt: Date
  }
}, {
  timestamps: true
});

// Update status based on payment
feeSchema.pre('save', function(next) {
  if (this.paidAmount >= this.amount) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else if (new Date() > this.dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'pending';
  }
  next();
});

export default mongoose.model('Fee', feeSchema);