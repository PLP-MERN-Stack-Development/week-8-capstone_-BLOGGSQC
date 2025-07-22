const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  parents: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian'],
      required: true
    },
    occupation: String,
    workPhone: String
  }],
  academicRecord: {
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    totalCredits: {
      type: Number,
      default: 0
    },
    rank: Number,
    awards: [{
      title: String,
      description: String,
      date: Date,
      category: String
    }]
  },
  attendance: {
    totalDays: {
      type: Number,
      default: 0
    },
    presentDays: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  medicalInfo: {
    allergies: [String],
    medications: [String],
    medicalConditions: [String],
    doctorName: String,
    doctorPhone: String
  },
  extracurricular: [{
    activity: String,
    role: String,
    startDate: Date,
    endDate: Date,
    achievements: [String]
  }],
  disciplinary: [{
    incident: String,
    date: Date,
    action: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  fees: {
    totalAmount: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    lastPaymentDate: Date
  },
  transportation: {
    busRoute: String,
    pickupPoint: String,
    dropPoint: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  graduationDate: Date,
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ class: 1 });
studentSchema.index({ academicYear: 1 });
studentSchema.index({ 'user.email': 1 });
studentSchema.index({ rollNumber: 1, class: 1 }, { unique: true });

// Virtual for age
studentSchema.virtual('age').get(function() {
  if (this.user && this.user.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return this.user ? this.user.name : '';
});

// Pre-save middleware
studentSchema.pre('save', async function(next) {
  // Generate student ID if not provided
  if (!this.studentId) {
    const year = new Date().getFullYear().toString().substr(-2);
    const count = await this.constructor.countDocuments({
      academicYear: this.academicYear
    });
    this.studentId = `STU${year}${(count + 1).toString().padStart(4, '0')}`;
  }

  // Calculate attendance percentage
  if (this.attendance.totalDays > 0) {
    this.attendance.percentage = Math.round(
      (this.attendance.presentDays / this.attendance.totalDays) * 100
    );
  }

  // Calculate pending fees
  this.fees.pendingAmount = this.fees.totalAmount - this.fees.paidAmount;

  next();
});

// Static method to get academic statistics
studentSchema.statics.getAcademicStats = async function(classId) {
  const stats = await this.aggregate([
    { $match: { class: mongoose.Types.ObjectId(classId), isActive: true } },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        avgGPA: { $avg: '$academicRecord.gpa' },
        avgAttendance: { $avg: '$attendance.percentage' },
        totalCredits: { $sum: '$academicRecord.totalCredits' }
      }
    }
  ]);

  return stats[0] || {
    totalStudents: 0,
    avgGPA: 0,
    avgAttendance: 0,
    totalCredits: 0
  };
};

// Method to update attendance
studentSchema.methods.updateAttendance = function(isPresent) {
  this.attendance.totalDays += 1;
  if (isPresent) {
    this.attendance.presentDays += 1;
  }
  this.attendance.percentage = Math.round(
    (this.attendance.presentDays / this.attendance.totalDays) * 100
  );
  return this.save();
};

// Method to add payment
studentSchema.methods.addPayment = function(amount) {
  this.fees.paidAmount += amount;
  this.fees.pendingAmount = this.fees.totalAmount - this.fees.paidAmount;
  this.fees.lastPaymentDate = new Date();
  return this.save();
};

module.exports = mongoose.model('Student', studentSchema);