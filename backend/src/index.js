import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import fileUpload from "express-fileupload";






dotenv.config();
console.log("Cloudinary Config:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "loaded" : "missing",
});

// Environment variable validation
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined in .env file");
  process.exit(1);
}

const app = express();

app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', 
  credentials: true 
}));
app.use(fileUpload({
  useTempFiles: true,        // needed if you want file.tempFilePath
  tempFileDir: '/tmp/',      // temp folder for uploads
  createParentPath: true     // auto-create folder if not exists
}));
app.use(express.json());

app.get('/', (_req, res) => res.send('PSQUARE Auth API ✅'));
app.use("/api/auth", authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);

const PORT = process.env.PORT || 5000;

// Connect with error handling
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log(`🍃 MongoDB Connected: ${process.env.MONGO_URI}`);
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });