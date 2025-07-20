import mongoose from 'mongoose';

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
    type: Number,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  parentContact: {
    father: {
      name: String,
      phone: String,
      email: String,
      occupation: String
    },
    mother: {
      name: String,
      phone: String,
      email: String,
      occupation: String
    },
    guardian: {
      name: String,
      phone: String,
      email: String,
      relationship: String
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    bloodGroup: String,
    allergies: [String],
    medications: [String],
    conditions: [String]
  },
  academicInfo: {
    previousSchool: String,
    previousGrade: String,
    transferCertificate: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);