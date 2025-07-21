import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Models
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

// Load env
dotenv.config();

// Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear old data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    console.log('🗑️ Cleared collections');

    // --------------------
    // ✅ ADMIN USER
    // --------------------
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.com',
      password: 'password123',
      role: 'admin',
      phone: '+1000000000',
      address: 'Admin HQ'
    });
    console.log('👤 Admin created');

    // --------------------
    // ✅ TEACHER USER
    // --------------------
    const teacherUser = await User.create({
      firstName: 'Demo',
      lastName: 'Teacher',
      email: 'teacher@school.com',
      password: 'password123',
      role: 'teacher',
      phone: '+1000000001',
      address: 'Teacher Street'
    });

    const teacherProfile = await Teacher.create({
      user: teacherUser._id,
      employeeId: 'T100',
      department: 'General',
      qualification: {
        degree: 'B.Ed',
        university: 'Education Uni',
        year: 2020,
        specialization: 'General'
      },
      experience: {
        totalYears: 3,
        previousSchools: []
      },
      salary: {
        basic: 30000,
        allowances: 5000,
        total: 35000
      }
    });
    console.log('👨‍🏫 Teacher created');

    // --------------------
    // ✅ SUBJECT
    // --------------------
    const subject = await Subject.create({
      name: 'General Studies',
      code: 'GEN101',
      description: 'Demo subject for teacher',
      grade: '10',
      teacher: teacherProfile._id,
      weeklyHours: 4
    });
    console.log('📚 Subject created');

    // --------------------
    // ✅ CLASS
    // --------------------
    const classA = await Class.create({
      name: 'Class 10A',
      grade: '10',
      section: 'A',
      classTeacher: teacherProfile._id,
      subjects: [subject._id],
      capacity: 40,
      room: 'Room 1',
      academicYear: '2024-2025'
    });
    console.log('🏫 Class created');

    // Update subject with class
    await Subject.findByIdAndUpdate(subject._id, { classes: [classA._id] });
    await Teacher.findByIdAndUpdate(teacherProfile._id, { subjects: [subject._id], classes: [classA._id] });

    // --------------------
    // ✅ STUDENT USER
    // --------------------
    const studentUser = await User.create({
      firstName: 'Demo',
      lastName: 'Student',
      email: 'student@school.com',
      password: 'password123',
      role: 'student',
      phone: '+1000000002',
      dateOfBirth: new Date('2008-05-15')
    });

    const studentProfile = await Student.create({
      user: studentUser._id,
      studentId: 'S100',
      class: classA._id,
      rollNumber: 1,
      parentContact: {
        father: { name: 'John Student', phone: '+1000000003', email: 'father@student.com', occupation: 'Engineer' },
        mother: { name: 'Jane Student', phone: '+1000000004', email: 'mother@student.com', occupation: 'Teacher' }
      },
      emergencyContact: { name: 'John Student', phone: '+1000000003', relationship: 'Father' }
    });
    console.log('👨‍🎓 Student created');

    await Class.findByIdAndUpdate(classA._id, { students: [studentProfile._id] });

    // --------------------
    // ✅ PARENT USER
    // --------------------
    const parentUser = await User.create({
      firstName: 'Demo',
      lastName: 'Parent',
      email: 'parent@school.com',
      password: 'password123',
      role: 'parent',
      phone: '+1000000005',
      address: 'Parent Avenue'
    });
    console.log('👩‍👦 Parent created');

    console.log('✅✅✅ Database seeded successfully!');
    console.log('--- DEMO CREDENTIALS ---');
    console.log('Admin: admin@school.com / password123');
    console.log('Teacher: teacher@school.com / password123');
    console.log('Student: student@school.com / password123');
    console.log('Parent: parent@school.com / password123');
  } catch (err) {
    console.error('❌ Seed error:', err);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeeder();
