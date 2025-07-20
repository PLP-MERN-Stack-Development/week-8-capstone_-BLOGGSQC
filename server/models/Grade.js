import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  examType: {
    type: String,
    enum: ['quiz', 'test', 'midterm', 'final', 'assignment', 'project'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxScore: {
    type: Number,
    default: 100
  },
  percentage: {
    type: Number
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  },
  feedback: {
    type: String
  },
  term: {
    type: String,
    enum: ['term1', 'term2', 'term3', 'final'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Calculate percentage and letter grade before saving
gradeSchema.pre('save', function(next) {
  this.percentage = (this.score / this.maxScore) * 100;
  
  if (this.percentage >= 97) this.letterGrade = 'A+';
  else if (this.percentage >= 93) this.letterGrade = 'A';
  else if (this.percentage >= 90) this.letterGrade = 'A-';
  else if (this.percentage >= 87) this.letterGrade = 'B+';
  else if (this.percentage >= 83) this.letterGrade = 'B';
  else if (this.percentage >= 80) this.letterGrade = 'B-';
  else if (this.percentage >= 77) this.letterGrade = 'C+';
  else if (this.percentage >= 73) this.letterGrade = 'C';
  else if (this.percentage >= 70) this.letterGrade = 'C-';
  else if (this.percentage >= 67) this.letterGrade = 'D+';
  else if (this.percentage >= 60) this.letterGrade = 'D';
  else this.letterGrade = 'F';
  
  next();
});

export default mongoose.model('Grade', gradeSchema);