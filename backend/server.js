import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';

// Load .env from backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const DB_NAME = process.env.DB_NAME || 'idpdb';

// ✅ Frontend URLs allowed (both local + production)
const allowedOrigins = [
  'https://law-assistant-go.vercel.app', // your production frontend
  'http://localhost:3000',               // local dev
];

// ✅ Enable CORS safely using middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like server-to-server, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browsers
  })
);

// ✅ Handle preflight requests globally
app.options('*', cors());

// ✅ Parse JSON requests
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.send('Server is running ✅'));

// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: DB_NAME,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
