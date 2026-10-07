import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const mongoUri = process.env.MONGODB_URI;

  // On Vercel / serverless without MONGODB_URI configured, do not waste timeout on localhost
  if (!mongoUri && process.env.VERCEL) {
    console.log('[Database] MONGODB_URI is not set on Vercel. Running in resilient in-memory fallback mode.');
    return false;
  }

  const targetUri = mongoUri || 'mongodb://localhost:27017/skillpath';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (primaryErr: any) {
    console.warn(`[Database] MongoDB connection to "${targetUri}" failed: ${primaryErr.message}`);

    // If local dev environment (not Vercel) and MongoMemoryServer is available, try it
    if (!process.env.VERCEL) {
      try {
        console.log('[Database] Initializing embedded in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();

        await mongoose.connect(memoryUri);
        isConnected = true;
        console.log(`[Database] Connected to embedded in-memory MongoDB at: ${memoryUri}`);

        process.on('SIGINT', async () => {
          await mongoose.disconnect();
          await mongod.stop();
          process.exit(0);
        });
        return true;
      } catch (fallbackErr: any) {
        console.warn(`[Database] MongoMemoryServer not initialized: ${fallbackErr.message}`);
      }
    }

    console.log('[Database] Fallback store active for demo logins and evaluation.');
    return false;
  }
};
