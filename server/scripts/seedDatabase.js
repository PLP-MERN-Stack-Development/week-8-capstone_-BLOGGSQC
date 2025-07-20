import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.com',
      password: 'password123',
      role: 'admin',
      phone: '+1234567890',
      address: '123 School Street, Education City'
    });

    console.log('👤 Created admin user');

    // Create teacher users
    const teacherUsers = await User.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@school.com',
        password: 'password123',
        role: 'teacher',
        phone: '+1234567891',
        address: '456 Teacher Lane, Education City'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@school.com',
        password: 'password123',
        role: 'teacher',
        phone: '+1234567892',
        address: '789 Educator Ave, Education City'
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@school.com',
        password: 'password123',
        role: 'teacher',
        phone: '+1234567893',
        address: '321 Faculty Road, Education City'
      }
    ]);

    console.log('👨‍🏫 Created teacher users');

    // Create teacher profiles
    const teachers = await Teacher.insertMany([
      {
        user: teacherUsers[0]._id,
        employeeId: 'T001',
        department: 'Mathematics',
        qualification: {
          degree: 'Master of Mathematics',
          university: 'State University',
          year: 2015,
          specialization: 'Applied Mathematics'
        },
        experience: {
          totalYears: 8,
          previousSchools: [
            {
              name: 'City High School',
              position: 'Math Teacher',
              duration: '2015-2020'
            }
          ]
        },
        salary: {
          basic: 50000,
          allowances: 10000,
          total: 60000
        }
      },
      {
        user: teacherUsers[1]._id,
        employeeId: 'T002',
        department: 'Science',
        qualification: {
          degree: 'Master of Science',
          university: 'Tech University',
          year: 2016,
          specialization: 'Physics'
        },
        experience: {
          totalYears: 7,
          previousSchools: [
            {
              name: 'Metro School',
              position: 'Science Teacher',
              duration: '2016-2021'
            }
          ]
        },
        salary: {
          basic: 52000,
          allowances: 12000,
          total: 64000
        }
      },
      {
        user: teacherUsers[2]._id,
        employeeId: 'T003',
        department: 'English',
        qualification: {
          degree: 'Master of Arts',
          university: 'Liberal Arts College',
          year: 2014,
          specialization: 'English Literature'
        },
        experience: {
          totalYears: 9,
          previousSchools: [
            {
              name: 'Grammar School',
              position: 'English Teacher',
              duration: '2014-2021'
            }
          ]
        },
        salary: {
          basic: 48000,
          allowances: 8000,
          total: 56000
        }
      }
    ]);

    console.log('👨‍🏫 Created teacher profiles');

    // Create subjects
    const subjects = await Subject.insertMany([
      {
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Advanced Mathematics for Grade 10',
        grade: '10',
        teacher: teachers[0]._id,
        weeklyHours: 6
      },
      {
        name: 'Physics',
        code: 'PHY101',
        description: 'Introduction to Physics',
        grade: '10',
        teacher: teachers[1]._id,
        weeklyHours: 4
      },
      {
        name: 'Chemistry',
        code: 'CHEM101',
        description: 'Basic Chemistry Concepts',
        grade: '10',
        teacher: teachers[1]._id,
        weeklyHours: 4
      },
      {
        name: 'English Literature',
        code: 'ENG101',
        description: 'English Language and Literature',
        grade: '10',
        teacher: teachers[2]._id,
        weeklyHours: 5
      }
    ]);

    console.log('📚 Created subjects');

    // Create classes
    const classes = await Class.insertMany([
      {
        name: 'Class 10A',
        grade: '10',
        section: 'A',
        classTeacher: teachers[0]._id,
        subjects: [subjects[0]._id, subjects[1]._id, subjects[2]._id, subjects[3]._id],
        capacity: 40,
        room: 'Room 101',
        academicYear: '2024-2025'
      },
      {
        name: 'Class 10B',
        grade: '10',
        section: 'B',
        classTeacher: teachers[1]._id,
        subjects: [subjects[0]._id, subjects[1]._id, subjects[2]._id, subjects[3]._id],
        capacity: 40,
        room: 'Room 102',
        academicYear: '2024-2025'
      }
    ]);

    console.log('🏫 Created classes');

    // Update subjects with classes
    await Subject.findByIdAndUpdate(subjects[0]._id, { classes: [classes[0]._id, classes[1]._id] });
    await Subject.findByIdAndUpdate(subjects[1]._id, { classes: [classes[0]._id, classes[1]._id] });
    await Subject.findByIdAndUpdate(subjects[2]._id, { classes: [classes[0]._id, classes[1]._id] });
    await Subject.findByIdAndUpdate(subjects[3]._id, { classes: [classes[0]._id, classes[1]._id] });

    // Update teachers with subjects and classes
    await Teacher.findByIdAndUpdate(teachers[0]._id, { 
      subjects: [subjects[0]._id], 
      classes: [classes[0]._id] 
    });
    await Teacher.findByIdAndUpdate(teachers[1]._id, { 
      subjects: [subjects[1]._id, subjects[2]._id], 
      classes: [classes[1]._id] 
    });
    await Teacher.findByIdAndUpdate(teachers[2]._id, { 
      subjects: [subjects[3]._id], 
      classes: [] 
    });

    // Create student users
    const studentUsers = await User.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Wilson',
        email: 'alice.wilson@student.school.com',
        password: 'password123',
        role: 'student',
        phone: '+1234567894',
        dateOfBirth: new Date('2008-05-15')
      },
      {
        firstName: 'Bob',
        lastName: 'Davis',
        email: 'bob.davis@student.school.com',
        password: 'password123',
        role: 'student',
        phone: '+1234567895',
        dateOfBirth: new Date('2008-08-22')
      },
      {
        firstName: 'Carol',
        lastName: 'Miller',
        email: 'carol.miller@student.school.com',
        password: 'password123',
        role: 'student',
        phone: '+1234567896',
        dateOfBirth: new Date('2008-03-10')
      },
      {
        firstName: 'David',
        lastName: 'Garcia',
        email: 'david.garcia@student.school.com',
        password: 'password123',
        role: 'student',
        phone: '+1234567897',
        dateOfBirth: new Date('2008-11-05')
      }
    ]);

    console.log('👨‍🎓 Created student users');

    // Create student profiles
    const students = await Student.insertMany([
      {
        user: studentUsers[0]._id,
        studentId: 'S2024001',
        class: classes[0]._id,
        rollNumber: 1,
        parentContact: {
          father: {
            name: 'Robert Wilson',
            phone: '+1234567898',
            email: 'robert.wilson@email.com',
            occupation: 'Engineer'
          },
          mother: {
            name: 'Linda Wilson',
            phone: '+1234567899',
            email: 'linda.wilson@email.com',
            occupation: 'Teacher'
          }
        },
        emergencyContact: {
          name: 'Robert Wilson',
          phone: '+1234567898',
          relationship: 'Father'
        }
      },
      {
        user: studentUsers[1]._id,
        studentId: 'S2024002',
        class: classes[0]._id,
        rollNumber: 2,
        parentContact: {
          father: {
            name: 'James Davis',
            phone: '+1234567900',
            email: 'james.davis@email.com',
            occupation: 'Doctor'
          },
          mother: {
            name: 'Mary Davis',
            phone: '+1234567901',
            email: 'mary.davis@email.com',
            occupation: 'Nurse'
          }
        },
        emergencyContact: {
          name: 'James Davis',
          phone: '+1234567900',
          relationship: 'Father'
        }
      },
      {
        user: studentUsers[2]._id,
        studentId: 'S2024003',
        class: classes[1]._id,
        rollNumber: 1,
        parentContact: {
          father: {
            name: 'William Miller',
            phone: '+1234567902',
            email: 'william.miller@email.com',
            occupation: 'Lawyer'
          },
          mother: {
            name: 'Susan Miller',
            phone: '+1234567903',
            email: 'susan.miller@email.com',
            occupation: 'Accountant'
          }
        },
        emergencyContact: {
          name: 'William Miller',
          phone: '+1234567902',
          relationship: 'Father'
        }
      },
      {
        user: studentUsers[3]._id,
        studentId: 'S2024004',
        class: classes[1]._id,
        rollNumber: 2,
        parentContact: {
          father: {
            name: 'Carlos Garcia',
            phone: '+1234567904',
            email: 'carlos.garcia@email.com',
            occupation: 'Business Owner'
          },
          mother: {
            name: 'Maria Garcia',
            phone: '+1234567905',
            email: 'maria.garcia@email.com',
            occupation: 'Designer'
          }
        },
        emergencyContact: {
          name: 'Carlos Garcia',
          phone: '+1234567904',
          relationship: 'Father'
        }
      }
    ]);

    console.log('👨‍🎓 Created student profiles');

    // Update classes with students
    await Class.findByIdAndUpdate(classes[0]._id, { 
      students: [students[0]._id, students[1]._id] 
    });
    await Class.findByIdAndUpdate(classes[1]._id, { 
      students: [students[2]._id, students[3]._id] 
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@school.com / password123');
    console.log('Teacher: john.smith@school.com / password123');
    console.log('Student: alice.wilson@student.school.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeeder();