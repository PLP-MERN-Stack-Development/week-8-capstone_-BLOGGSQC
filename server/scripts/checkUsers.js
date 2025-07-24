require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    console.log('🔎 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DB_NAME,
    });

    const users = await User.find().lean();
    console.log('✅ Users in DB:', users);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking users:', err);
    process.exit(1);
  }
})();
