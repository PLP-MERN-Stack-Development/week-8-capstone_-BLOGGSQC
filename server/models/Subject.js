const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [10, 'Credits cannot exceed 10']
  },
  grade: {
    type: String,
    required: [true, 'Grade level is required']
  },
  type: {
    type: String,
    enum: ['core', 'elective', 'optional'],
    default: 'core'
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  syllabus: [{
    unit: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    topics: [String],
    duration: Number, // in hours
    resources: [{
      name: String,
      type: {
        type: String,
        enum: ['book', 'video', 'article', 'website', 'other']
      },
      url: String,
      author: String
    }]
  }],
  teachers: [{
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    classes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }],
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  assessments: {
    internal: {
      type: Number,
      default: 40,
      min: 0,
      max: 100
    },
    external: {
      type: Number,
      default: 60,
      min: 0,
      max: 100
    },
    practical: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['textbook', 'reference', 'video', 'presentation', 'document', 'other']
    },
    author: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  schedule: {
    hoursPerWeek: {
      type: Number,
      required: true,
      min: 1
    },
    totalHours: {
      type: Number,
      required: true
    },
    practicalHours: {
      type: Number,
      default: 0
    }
  },
  performance: {
    averageScore: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required']
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
subjectSchema.index({ code: 1 }, { unique: true });
subjectSchema.index({ department: 1 });
subjectSchema.index({ grade: 1 });
subjectSchema.index({ academicYear: 1 });
subjectSchema.index({ isActive: 1 });

// Virtual for total assessment weightage
subjectSchema.virtual('totalAssessment').get(function() {
  return this.assessments.internal + this.assessments.external + this.assessments.practical;
});

// Virtual for subject full name
subjectSchema.virtual('fullName').get(function() {
  return `${this.code} - ${this.name}`;
});

// Pre-save validation
subjectSchema.pre('save', function(next) {
  // Validate assessment weightage totals to 100
  const total = this.assessments.internal + this.assessments.external + this.assessments.practical;
  if (total !== 100) {
    return next(new Error('Assessment weightages must total 100%'));
  }
  
  next();
});

// Static method to get subject statistics by department
subjectSchema.statics.getDepartmentStats = async function(department) {
  const stats = await this.aggregate([
    { $match: { department, isActive: true } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCredits: { $sum: '$credits' },
        avgScore: { $avg: '$performance.averageScore' },
        avgPassRate: { $avg: '$performance.passRate' }
      }
    }
  ]);

  return stats;
};

// Method to add teacher assignment
subjectSchema.methods.assignTeacher = function(teacherId, classIds = []) {
  const existingAssignment = this.teachers.find(
    t => t.teacher.toString() === teacherId.toString()
  );

  if (existingAssignment) {
    // Update existing assignment
    existingAssignment.classes = [...new Set([...existingAssignment.classes, ...classIds])];
  } else {
    // Create new assignment
    this.teachers.push({
      teacher: teacherId,
      classes: classIds,
      assignedDate: new Date()
    });
  }

  return this.save();
};

// Method to remove teacher assignment
subjectSchema.methods.removeTeacher = function(teacherId) {
  this.teachers = this.teachers.filter(
    t => t.teacher.toString() !== teacherId.toString()
  );
  return this.save();
};

// Method to add resource
subjectSchema.methods.addResource = function(resourceData, userId) {
  this.resources.push({
    ...resourceData,
    uploadedBy: userId,
    uploadDate: new Date()
  });
  return this.save();
};

// Method to update performance metrics
subjectSchema.methods.updatePerformance = function(performanceData) {
  this.performance = {
    ...this.performance,
    ...performanceData
  };
  return this.save();
};

module.exports = mongoose.model('Subject', subjectSchema);