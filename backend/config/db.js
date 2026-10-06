const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

/**
 * Connect to MongoDB Database
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // If set to auto, explicitly spin up MongoMemoryServer
  if (!uri || uri === 'auto') {
    try {
      console.log('🔄 Starting embedded in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'expense_tracker'
        }
      });
      uri = mongoServer.getUri();
      console.log(`📦 Embedded MongoDB initialized at: ${uri}`);
    } catch (err) {
      console.error('❌ Failed to start embedded MongoDB:', err.message);
      process.exit(1);
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);

    // Auto-seed demo dataset if database is fresh/empty
    const { seedDB } = require('../data/seedData');
    await seedDB(false);
  } catch (error) {
    // If connection to localhost failed and embedded wasn't used yet, fallback to embedded
    if (!mongoServer && (uri.includes('127.0.0.1') || uri.includes('localhost'))) {
      console.warn(`⚠️ Could not reach local MongoDB at ${uri}. Launching embedded MongoDB fallback...`);
      try {
        mongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'expense_tracker'
          }
        });
        const fallbackUri = mongoServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ Embedded MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
        const { seedDB } = require('../data/seedData');
        await seedDB(false);
        return;
      } catch (memErr) {
        console.error(`❌ Embedded MongoDB fallback failed: ${memErr.message}`);
        process.exit(1);
      }
    }

    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;

