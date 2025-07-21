import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignmentSubmission {
  student: mongoose.Types.ObjectId;
  submissionDate: Date;
  content?: string;
  attachments: string[];
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  dueDate: Date;
  totalMarks: number;
  attachments: string[];
  submissions: IAssignmentSubmission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  content: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String,
    trim: true
  }],
  marks: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late'],
    default: 'submitted'
  },
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: {
    type: Date
  }
}, { _id: true });

const assignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  attachments: [{
    type: String,
    trim: true
  }],
  submissions: [assignmentSubmissionSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ subject: 1, class: 1 });
assignmentSchema.index({ teacher: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);