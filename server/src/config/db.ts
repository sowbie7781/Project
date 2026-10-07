import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillpath';

  try {
    // Attempt standard connection first
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}`);
  } catch (primaryErr: any) {
    console.warn(`[Database] Standard MongoDB connection failed: ${primaryErr.message}`);

    // If in dev or standalone mode and local mongo isn't running, spin up MongoMemoryServer
    try {
      console.log('[Database] Initializing embedded in-memory MongoDB fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const memoryConn = await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[Database] Connected to embedded in-memory MongoDB at: ${memoryUri}`);

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
      });
    } catch (fallbackErr: any) {
      console.error(`[Database] Failed to start embedded in-memory MongoDB: ${fallbackErr.message}`);
      throw primaryErr;
    }
  }
};
