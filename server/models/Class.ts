import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string;
  section: string;
  teacher: mongoose.Types.ObjectId;
  subjects: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  classroom: string;
  capacity: number;
  academicYear: string;
  timetable: {
    day: string;
    periods: {
      startTime: string;
      endTime: string;
      subject: mongoose.Types.ObjectId;
      teacher: mongoose.Types.ObjectId;
    }[];
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [20, 'Class name cannot exceed 20 characters']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxlength: [10, 'Section cannot exceed 10 characters']
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Class teacher is required']
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  classroom: {
    type: String,
    required: [true, 'Classroom is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  },
  timetable: [{
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    periods: [{
      startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
      },
      teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
classSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ teacher: 1 });
classSchema.index({ academicYear: 1 });

export default mongoose.model<IClass>('Class', classSchema);