import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';

// Load .env from the backend folder regardless of where the server is started
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Config

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const DB_NAME = process.env.DB_NAME || 'idpdb';
// CORS: allow a single origin or a comma-separated list in CORS_ORIGIN
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = Array.isArray(rawCors) ? rawCors : rawCors.split(',').map(s => s.trim()).filter(Boolean);

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    // not in allowed list
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => {
  res.send('server is running');
});
// Mongo connect and start
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: DB_NAME,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
