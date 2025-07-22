const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    grade: String
  }],
  experience: {
    totalYears: {
      type: Number,
      default: 0
    },
    previousInstitutions: [{
      name: String,
      position: String,
      duration: String,
      reason: String
    }]
  },
  joiningDate: {
    type: Date,
    required: true
  },
  salary: {
    basic: Number,
    allowances: Number,
    deductions: Number,
    total: Number
  },
  schedule: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: String,
      end: String
    },
    timeTable: [{
      day: String,
      periods: [{
        time: String,
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject'
        },
        class: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        },
        room: String
      }]
    }]
  },
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    reviews: [{
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      date: Date
    }],
    achievements: [{
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
    leaveDays: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  leaves: [{
    type: {
      type: String,
      enum: ['sick', 'casual', 'maternity', 'paternity', 'vacation', 'other']
    },
    startDate: Date,
    endDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolderName: String
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  terminationDate: Date,
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
teacherSchema.index({ employeeId: 1 }, { unique: true });
teacherSchema.index({ department: 1 });
teacherSchema.index({ isActive: 1 });
teacherSchema.index({ joiningDate: 1 });

// Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return this.user ? this.user.name : '';
});

// Virtual for experience in years
teacherSchema.virtual('experienceYears').get(function() {
  if (this.joiningDate) {
    const today = new Date();
    const joinDate = new Date(this.joiningDate);
    const diffTime = Math.abs(today - joinDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }
  return 0;
});

// Pre-save middleware
teacherSchema.pre('save', async function(next) {
  // Generate employee ID if not provided
  if (!this.employeeId) {
    const year = new Date().getFullYear().toString().substr(-2);
    const count = await this.constructor.countDocuments();
    this.employeeId = `EMP${year}${(count + 1).toString().padStart(4, '0')}`;
  }

  // Calculate attendance percentage
  if (this.attendance.totalDays > 0) {
    this.attendance.percentage = Math.round(
      (this.attendance.presentDays / this.attendance.totalDays) * 100
    );
  }

  // Calculate total salary
  if (this.salary) {
    this.salary.total = (this.salary.basic || 0) + 
                      (this.salary.allowances || 0) - 
                      (this.salary.deductions || 0);
  }

  next();
});

// Static method to get department statistics
teacherSchema.statics.getDepartmentStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 },
        avgRating: { $avg: '$performance.rating' },
        avgExperience: { $avg: '$experience.totalYears' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return stats;
};

// Method to calculate workload
teacherSchema.methods.calculateWorkload = function() {
  const totalPeriods = this.schedule.timeTable.reduce((total, day) => {
    return total + (day.periods ? day.periods.length : 0);
  }, 0);

  return {
    totalPeriods,
    totalSubjects: this.subjects.length,
    totalClasses: this.classes.length,
    workloadScore: totalPeriods + (this.subjects.length * 2) + (this.classes.length * 3)
  };
};

// Method to apply for leave
teacherSchema.methods.applyLeave = function(leaveData) {
  this.leaves.push({
    ...leaveData,
    appliedDate: new Date(),
    status: 'pending'
  });
  return this.save();
};

// Method to update attendance
teacherSchema.methods.markAttendance = function(isPresent, isLeave = false) {
  this.attendance.totalDays += 1;
  if (isPresent) {
    this.attendance.presentDays += 1;
  } else if (isLeave) {
    this.attendance.leaveDays += 1;
  }
  this.attendance.percentage = Math.round(
    (this.attendance.presentDays / this.attendance.totalDays) * 100
  );
  return this.save();
};

module.exports = mongoose.model('Teacher', teacherSchema);