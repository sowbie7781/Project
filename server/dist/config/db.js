"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
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
        const conn = await mongoose_1.default.connect(targetUri, {
            serverSelectionTimeoutMS: 2500,
        });
        isConnected = true;
        console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}`);
        return true;
    }
    catch (primaryErr) {
        console.warn(`[Database] MongoDB connection to "${targetUri}" failed: ${primaryErr.message}`);
        // If local dev environment (not Vercel) and MongoMemoryServer is available, try it
        if (!process.env.VERCEL) {
            try {
                console.log('[Database] Initializing embedded in-memory MongoDB fallback...');
                const { MongoMemoryServer } = await Promise.resolve().then(() => __importStar(require('mongodb-memory-server')));
                const mongod = await MongoMemoryServer.create();
                const memoryUri = mongod.getUri();
                await mongoose_1.default.connect(memoryUri);
                isConnected = true;
                console.log(`[Database] Connected to embedded in-memory MongoDB at: ${memoryUri}`);
                process.on('SIGINT', async () => {
                    await mongoose_1.default.disconnect();
                    await mongod.stop();
                    process.exit(0);
                });
                return true;
            }
            catch (fallbackErr) {
                console.warn(`[Database] MongoMemoryServer not initialized: ${fallbackErr.message}`);
            }
        }
        console.log('[Database] Fallback store active for demo logins and evaluation.');
        return false;
    }
};
exports.connectDB = connectDB;
