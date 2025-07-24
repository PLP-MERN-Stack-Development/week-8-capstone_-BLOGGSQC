require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  try {
    console.log('🔎 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DB_NAME || 'edutech-pro',
    });

    const user = await User.findOne({ email: 'admin@edutech-pro.com' }).select('+password');
    if (!user) {
      console.error('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('🔎 User password hash from DB:', user.password);

    // ✅ Test against plain text
    const isMatch = await bcrypt.compare('Admin1234', user.password);
    console.log(`✅ Does "Admin1234" match hash? ->`, isMatch);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking password:', err);
    process.exit(1);
  }
})();
