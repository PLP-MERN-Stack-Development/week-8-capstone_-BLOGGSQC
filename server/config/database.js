// config/database.js
const mongoose = require('mongoose');
require('dotenv').config(); // ensure .env is loaded

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('⚠️  MONGODB_URI not set in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      // these options are optional in Mongoose 6+ but safe to include
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`
✅ MongoDB Connected Successfully!
📍 Host: ${conn.connection.host}
🏷️  Database: ${conn.connection.name}
🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting'}
    `);

    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown on app termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB shutdown:', error);
    process.exit(1);
  }
});

module.exports = { connectDB };
