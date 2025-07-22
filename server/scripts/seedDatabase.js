const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'System Administrator',
    email: 'admin@edutech-pro.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '+1-555-0001',
    isActive: true
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@edutech-pro.com',
    password: 'Teacher123!',
    role: 'teacher',
    phone: '+1-555-0002',
    isActive: true
  },
  {
    name: 'Prof. Michael Chen',
    email: 'michael.chen@edutech-pro.com',
    password: 'Teacher123!',
    role: 'teacher',
    phone: '+1-555-0003',
    isActive: true
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@edutech-pro.com',
    password: 'Teacher123!',
    role: 'teacher',
    phone: '+1-555-0004',
    isActive: true
  },
  {
    name: 'John Smith',
    email: 'john.smith@student.edutech-pro.com',
    password: 'Student123!',
    role: 'student',
    phone: '+1-555-1001',
    dateOfBirth: new Date('2008-05-15'),
    gender: 'male',
    isActive: true
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@student.edutech-pro.com',
    password: 'Student123!',
    role: 'student',
    phone: '+1-555-1002',
    dateOfBirth: new Date('2008-08-22'),
    gender: 'female',
    isActive: true
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@student.edutech-pro.com',
    password: 'Student123!',
    role: 'student',
    phone: '+1-555-1003',
    dateOfBirth: new Date('2009-03-10'),
    gender: 'male',
    isActive: true
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edutech-pro.com',
    password: 'Student123!',
    role: 'student',
    phone: '+1-555-1004',
    dateOfBirth: new Date('2008-12-05'),
    gender: 'female',
    isActive: true
  },
  {
    name: 'David Brown',
    email: 'david.brown@student.edutech-pro.com',
    password: 'Student123!',
    role: 'student',
    phone: '+1-555-1005',
    dateOfBirth: new Date('2009-01-18'),
    gender: 'male',
    isActive: true
  },
  {
    name: 'Robert Smith',
    email: 'robert.smith@parent.edutech-pro.com',
    password: 'Parent123!',
    role: 'parent',
    phone: '+1-555-2001',
    isActive: true
  },
  {
    name: 'Lisa Johnson',
    email: 'lisa.johnson@parent.edutech-pro.com',
    password: 'Parent123!',
    role: 'parent',
    phone: '+1-555-2002',
    isActive: true
  }
];

const sampleSubjects = [
  {
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Advanced Mathematics including Algebra, Geometry, and Calculus',
    department: 'Mathematics',
    credits: 4,
    grade: 'Grade 10',
    type: 'core',
    academicYear: '2024-2025',
    schedule: {
      hoursPerWeek: 5,
      totalHours: 180
    },
    syllabus: [
      {
        unit: 1,
        title: 'Algebra',
        topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
        duration: 60
      },
      {
        unit: 2,
        title: 'Geometry',
        topics: ['Triangles', 'Circles', 'Coordinate Geometry'],
        duration: 60
      },
      {
        unit: 3,
        title: 'Statistics',
        topics: ['Mean, Median, Mode', 'Probability', 'Data Analysis'],
        duration: 60
      }
    ]
  },
  {
    name: 'English Literature',
    code: 'ENG101',
    description: 'English Language and Literature studies',
    department: 'English',
    credits: 3,
    grade: 'Grade 10',
    type: 'core',
    academicYear: '2024-2025',
    schedule: {
      hoursPerWeek: 4,
      totalHours: 144
    }
  },
  {
    name: 'Physics',
    code: 'PHY101',
    description: 'Fundamental principles of Physics',
    department: 'Science',
    credits: 4,
    grade: 'Grade 10',
    type: 'core',
    academicYear: '2024-2025',
    schedule: {
      hoursPerWeek: 5,
      totalHours: 180,
      practicalHours: 60
    }
  },
  {
    name: 'Chemistry',
    code: 'CHE101',
    description: 'Basic Chemistry concepts and laboratory work',
    department: 'Science',
    credits: 4,
    grade: 'Grade 10',
    type: 'core',
    academicYear: '2024-2025',
    schedule: {
      hoursPerWeek: 5,
      totalHours: 180,
      practicalHours: 60
    }
  },
  {
    name: 'History',
    code: 'HIS101',
    description: 'World History and Social Studies',
    department: 'Social Studies',
    credits: 3,
    grade: 'Grade 10',
    type: 'core',
    academicYear: '2024-2025',
    schedule: {
      hoursPerWeek: 3,
      totalHours: 108
    }
  }
];

// Seeding functions
const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedSubjects = async (users) => {
  console.log('🌱 Seeding subjects...');
  
  try {
    // Clear existing subjects
    await Subject.deleteMany({});
    
    // Find admin user for metadata
    const adminUser = users.find(u => u.role === 'admin');
    
    const subjects = [];
    for (const subjectData of sampleSubjects) {
      const subject = new Subject({
        ...subjectData,
        metadata: {
          createdBy: adminUser._id
        }
      });
      await subject.save();
      subjects.push(subject);
    }
    
    console.log(`✅ Created ${subjects.length} subjects`);
    return subjects;
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
};

const seedTeachers = async (users, subjects) => {
  console.log('🌱 Seeding teachers...');
  
  try {
    // Clear existing teachers
    await Teacher.deleteMany({});
    
    const teacherUsers = users.filter(u => u.role === 'teacher');
    const teachers = [];
    
    for (let i = 0; i < teacherUsers.length; i++) {
      const teacherUser = teacherUsers[i];
      const assignedSubjects = subjects.slice(i, i + 2); // Assign 2 subjects per teacher
      
      const teacher = new Teacher({
        user: teacherUser._id,
        department: assignedSubjects[0]?.department || 'General',
        position: i === 0 ? 'Head of Department' : 'Teacher',
        subjects: assignedSubjects.map(s => s._id),
        qualifications: [
          {
            degree: 'Master of Education',
            institution: 'State University',
            year: 2020,
            grade: 'A'
          },
          {
            degree: 'Bachelor of Science',
            institution: 'State University',
            year: 2018,
            grade: 'A+'
          }
        ],
        experience: {
          totalYears: 5 + i,
          previousInstitutions: []
        },
        joiningDate: new Date('2023-08-01'),
        salary: {
          basic: 50000 + (i * 5000),
          allowances: 10000,
          deductions: 2000
        },
        schedule: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '08:00',
            end: '16:00'
          }
        },
        performance: {
          rating: 4 + (Math.random() * 1), // 4-5 rating
          achievements: []
        }
      });
      
      await teacher.save();
      teachers.push(teacher);
      
      // Update subjects with teacher assignments
      for (const subject of assignedSubjects) {
        await Subject.findByIdAndUpdate(
          subject._id,
          {
            $push: {
              teachers: {
                teacher: teacher._id,
                classes: [],
                assignedDate: new Date()
              }
            }
          }
        );
      }
    }
    
    console.log(`✅ Created ${teachers.length} teachers`);
    return teachers;
  } catch (error) {
    console.error('❌ Error seeding teachers:', error);
    throw error;
  }
};

const seedClasses = async (users, teachers, subjects) => {
  console.log('🌱 Seeding classes...');
  
  try {
    // Clear existing classes
    await Class.deleteMany({});
    
    const adminUser = users.find(u => u.role === 'admin');
    const sampleClasses = [
      {
        name: 'Grade 10A',
        grade: 'Grade 10',
        section: 'A',
        academicYear: '2024-2025',
        classTeacher: teachers[0]._id,
        capacity: 30,
        room: {
          number: '101',
          building: 'Main Block',
          floor: '1st Floor',
          capacity: 35,
          facilities: ['Projector', 'Whiteboard', 'Air Conditioning']
        },
        subjects: subjects.map(subject => ({
          subject: subject._id,
          teacher: teachers[Math.floor(Math.random() * teachers.length)]._id
        })),
        fees: {
          tuitionFee: 25000,
          labFee: 5000,
          libraryFee: 2000,
          miscellaneousFee: 3000
        }
      },
      {
        name: 'Grade 10B',
        grade: 'Grade 10',
        section: 'B',
        academicYear: '2024-2025',
        classTeacher: teachers[1]._id,
        capacity: 30,
        room: {
          number: '102',
          building: 'Main Block',
          floor: '1st Floor',
          capacity: 35,
          facilities: ['Projector', 'Whiteboard', 'Air Conditioning']
        },
        subjects: subjects.map(subject => ({
          subject: subject._id,
          teacher: teachers[Math.floor(Math.random() * teachers.length)]._id
        })),
        fees: {
          tuitionFee: 25000,
          labFee: 5000,
          libraryFee: 2000,
          miscellaneousFee: 3000
        }
      }
    ];
    
    const classes = [];
    for (const classData of sampleClasses) {
      const classObj = new Class({
        ...classData,
        metadata: {
          createdBy: adminUser._id
        }
      });
      await classObj.save();
      classes.push(classObj);
    }
    
    console.log(`✅ Created ${classes.length} classes`);
    return classes;
  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    throw error;
  }
};

const seedStudents = async (users, classes) => {
  console.log('🌱 Seeding students...');
  
  try {
    // Clear existing students
    await Student.deleteMany({});
    
    const studentUsers = users.filter(u => u.role === 'student');
    const parentUsers = users.filter(u => u.role === 'parent');
    const students = [];
    
    for (let i = 0; i < studentUsers.length; i++) {
      const studentUser = studentUsers[i];
      const assignedClass = classes[i % classes.length]; // Distribute students across classes
      const parentUser = parentUsers[Math.floor(i / 2)]; // 2 students per parent
      
      const student = new Student({
        user: studentUser._id,
        class: assignedClass._id,
        rollNumber: (i + 1).toString().padStart(3, '0'),
        section: assignedClass.section,
        academicYear: '2024-2025',
        admissionDate: new Date('2024-08-01'),
        bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'][i % 6],
        emergencyContact: {
          name: parentUser ? parentUser.name : 'Emergency Contact',
          relationship: 'Parent',
          phone: parentUser ? parentUser.phone : '+1-555-9999',
          email: parentUser ? parentUser.email : 'emergency@example.com'
        },
        parents: parentUser ? [{
          user: parentUser._id,
          relationship: i % 2 === 0 ? 'father' : 'mother',
          occupation: 'Professional',
          workPhone: parentUser.phone
        }] : [],
        academicRecord: {
          gpa: 2.5 + (Math.random() * 1.5), // 2.5 to 4.0 GPA
          totalCredits: 20 + Math.floor(Math.random() * 20),
          rank: i + 1,
          awards: []
        },
        attendance: {
          totalDays: 100 + Math.floor(Math.random() * 50),
          presentDays: 85 + Math.floor(Math.random() * 15),
        },
        medicalInfo: {
          allergies: [],
          medications: [],
          medicalConditions: [],
          doctorName: 'Dr. Health',
          doctorPhone: '+1-555-DOCTOR'
        },
        fees: {
          totalAmount: assignedClass.fees.totalFee,
          paidAmount: assignedClass.fees.totalFee * (0.5 + Math.random() * 0.5), // 50-100% paid
        }
      });
      
      await student.save();
      students.push(student);
      
      // Add student to class
      await Class.findByIdAndUpdate(
        assignedClass._id,
        { $push: { students: student._id } }
      );
    }
    
    console.log(`✅ Created ${students.length} students`);
    return students;
  } catch (error) {
    console.error('❌ Error seeding students:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    await connectDB();
    
    const users = await seedUsers();
    const subjects = await seedSubjects(users);
    const teachers = await seedTeachers(users, subjects);
    const classes = await seedClasses(users, teachers, subjects);
    const students = await seedStudents(users, classes);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('Admin: admin@edutech-pro.com / Admin123!');
    console.log('Teacher: sarah.johnson@edutech-pro.com / Teacher123!');
    console.log('Student: john.smith@student.edutech-pro.com / Student123!');
    console.log('Parent: robert.smith@parent.edutech-pro.com / Parent123!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  sampleUsers,
  sampleSubjects
};