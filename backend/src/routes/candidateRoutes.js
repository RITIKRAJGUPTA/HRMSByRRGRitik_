import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import {
  createCandidate,
  listCandidates,
  updateCandidate,
  deleteCandidate,
  getResume,
} from '../controllers/candidateController.js';
// import { auth } from '../middleware/auth.js'; // if you want to protect

const router = express.Router();

// Configure Cloudinary "raw" (PDF) upload via multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'psquare-resumes',
    resource_type: 'raw', // allow pdf/docx
    format: async (_req, file) => file.originalname.split('.').pop(), // keep ext
    public_id: (_req, file) => `resume_${Date.now()}`,
  },
});
const upload = multer({ storage });

router.get('/', /*auth(),*/ listCandidates);
router.post("/", createCandidate);
router.patch('/:id', /*auth(['HR']),*/ updateCandidate);
router.delete('/:id', /*auth(['HR']),*/ deleteCandidate);
router.get('/:id/resume', /*auth(),*/ getResume);

export default router;
