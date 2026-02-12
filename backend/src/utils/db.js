import mongoose from 'mongoose';

/**
 * Database connection function
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB: ${error.message}`);
    throw error; // Don't exit, let caller handle it
  }
};

/**
 * Disconnect from database
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error(`✗ Error disconnecting: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB, disconnectDB };
