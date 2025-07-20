import mongoose from 'mongoose';

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
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  qualification: {
    degree: String,
    university: String,
    year: Number,
    specialization: String
  },
  experience: {
    totalYears: Number,
    previousSchools: [{
      name: String,
      position: String,
      duration: String
    }]
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    basic: Number,
    allowances: Number,
    total: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);