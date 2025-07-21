import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  studentId: string;
  class: mongoose.Types.ObjectId;
  section: string;
  rollNumber: number;
  parentId?: mongoose.Types.ObjectId;
  admissionDate: Date;
  dateOfBirth: Date;
  bloodGroup?: string;
  medicalConditions?: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxlength: [10, 'Section cannot exceed 10 characters']
  },
  rollNumber: {
    type: Number,
    required: [true, 'Roll number is required'],
    min: [1, 'Roll number must be positive']
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: null
  },
  medicalConditions: [{
    type: String,
    trim: true
  }],
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    }
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ studentId: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ rollNumber: 1, class: 1, section: 1 }, { unique: true });

export default mongoose.model<IStudent>('Student', studentSchema);