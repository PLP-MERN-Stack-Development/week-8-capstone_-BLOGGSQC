const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required']
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    }
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  capacity: {
    type: Number,
    required: [true, 'Class capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  room: {
    number: String,
    building: String,
    floor: String,
    capacity: Number,
    facilities: [String]
  },
  schedule: {
    startTime: String,
    endTime: String,
    breakTimes: [{
      name: String,
      startTime: String,
      endTime: String
    }],
    timeTable: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      periods: [{
        time: String,
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject'
        },
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Teacher'
        },
        duration: Number // in minutes
      }]
    }]
  },
  performance: {
    averageGrade: {
      type: Number,
      default: 0
    },
    attendanceRate: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    }
  },
  resources: [{
    name: String,
    type: {
      type: String,
      enum: ['book', 'equipment', 'software', 'other']
    },
    quantity: Number,
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  }],
  events: [{
    title: String,
    description: String,
    date: Date,
    type: {
      type: String,
      enum: ['exam', 'assignment', 'field-trip', 'presentation', 'other']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  }],
  fees: {
    tuitionFee: {
      type: Number,
      default: 0
    },
    labFee: {
      type: Number,
      default: 0
    },
    libraryFee: {
      type: Number,
      default: 0
    },
    miscellaneousFee: {
      type: Number,
      default: 0
    },
    totalFee: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
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
classSchema.index({ grade: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ academicYear: 1 });
classSchema.index({ classTeacher: 1 });
classSchema.index({ isActive: 1 });

// Virtual for full class name
classSchema.virtual('fullName').get(function() {
  return `${this.grade} - ${this.section}`;
});

// Virtual for current enrollment
classSchema.virtual('currentEnrollment').get(function() {
  return this.students ? this.students.length : 0;
});

// Virtual for availability
classSchema.virtual('availableSeats').get(function() {
  return this.capacity - (this.students ? this.students.length : 0);
});

// Pre-save middleware
classSchema.pre('save', function(next) {
  // Calculate total fee
  this.fees.totalFee = 
    (this.fees.tuitionFee || 0) + 
    (this.fees.labFee || 0) + 
    (this.fees.libraryFee || 0) + 
    (this.fees.miscellaneousFee || 0);
  
  next();
});

// Static method to get class statistics
classSchema.statics.getClassStats = async function(academicYear) {
  const stats = await this.aggregate([
    { $match: { academicYear, isActive: true } },
    {
      $group: {
        _id: null,
        totalClasses: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' },
        totalEnrolled: { $sum: { $size: '$students' } },
        avgPerformance: { $avg: '$performance.averageGrade' },
        avgAttendance: { $avg: '$performance.attendanceRate' }
      }
    }
  ]);

  return stats[0] || {
    totalClasses: 0,
    totalCapacity: 0,
    totalEnrolled: 0,
    avgPerformance: 0,
    avgAttendance: 0
  };
};

// Method to add student to class
classSchema.methods.addStudent = function(studentId) {
  if (this.students.length >= this.capacity) {
    throw new Error('Class is at full capacity');
  }
  
  if (!this.students.includes(studentId)) {
    this.students.push(studentId);
  }
  
  return this.save();
};

// Method to remove student from class
classSchema.methods.removeStudent = function(studentId) {
  this.students = this.students.filter(
    student => student.toString() !== studentId.toString()
  );
  return this.save();
};

// Method to update performance metrics
classSchema.methods.updatePerformance = function(performanceData) {
  this.performance = {
    ...this.performance,
    ...performanceData
  };
  return this.save();
};

// Method to add event
classSchema.methods.addEvent = function(eventData) {
  this.events.push({
    ...eventData,
    date: eventData.date || new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Class', classSchema);