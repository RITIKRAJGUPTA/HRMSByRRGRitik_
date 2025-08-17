import Candidate from '../models/Candidate.js';
import Employee from '../models/Employee.js';
import cloudinary from "../config/cloudinary.js";
import https from "https";

// ✅ Create Candidate
export const createCandidate = async (req, res) => {
  try {
    // console.log("👉 Incoming request body:", req.body);
    // console.log("👉 Incoming request files:", req.files);

    const { name, email, phone, department, roleLevel, jobTitle, experience } = req.body;

    // 🔒 Validate required fields
    if (!name || !email || !phone || !department || !roleLevel || !jobTitle || !experience) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 🔒 Validate resume
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const file = req.files.resume;

    if (
      !file.mimetype.includes("pdf") &&
      !file.mimetype.includes("msword") &&
      !file.mimetype.includes("officedocument")
    ) {
      return res.status(400).json({ message: "Only PDF or Word documents are allowed" });
    }

    // ✅ Upload resume to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "resumes",
      resource_type: "raw", // ✅ PDF/Word upload fix
    });

    // ✅ Save to DB
    const candidate = await Candidate.create({
      name,
      email,
      phone,
      department,
      roleLevel,
      jobTitle,
      experience,
      status: "New", // default
      resumeUrl: result.secure_url,
      resumePublicId: result.public_id,
    });

    res.status(201).json({ success: true, candidate });
  } catch (err) {
    console.error("Candidate creation failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Update Candidate Status
// export const updateCandidateStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const candidate = await Candidate.findById(id);
//     if (!candidate) return res.status(404).json({ message: "Candidate not found" });

//     // If status is selected → move to Employee
//     if (status === "Selected") {
//       const employee = await Employee.create({
//         name: candidate.name,
//         email: candidate.email,
//         phone: candidate.phone,
//         department: candidate.department,
//         roleLevel: candidate.roleLevel,
//         jobTitle: candidate.jobTitle,
//         dateOfJoining: new Date(),
//       });

//       // Remove candidate from candidates collection
//       await candidate.deleteOne();

//       return res.status(200).json({ success: true, employee });
//     }

//     // Else just update status
//     candidate.status = status;
//     await candidate.save();

//     res.status(200).json({ success: true, candidate });
//   } catch (err) {
//     console.error("Update candidate status failed:", err);
//     res.status(500).json({ message: err.message || "Server error" });
//   }
// };

// LIST with filters/search
export const listCandidates = async (req, res) => {
  try {
    const { status, roleLevel, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (roleLevel) query.roleLevel = roleLevel;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const before = await Candidate.findById(id);
    if (!before) return res.status(404).json({ message: 'Not found' });

    const updated = await Candidate.findByIdAndUpdate(id, req.body, { new: true });

    if (before.status !== 'Selected' && updated.status === 'Selected') {
      await Employee.updateOne(
        { email: updated.email },
        { 
          $set: { 
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            roleLevel: updated.roleLevel,
            jobTitle: updated.jobTitle,
            department: updated.department || 'HR', // Default or get from req
            source: 'candidate',
            dateOfJoining: new Date() // Explicit set
          } 
        },
        { upsert: true }
      );
      
      // Optional: Add toast/notification here
      console.log(`Created employee record for ${updated.email}`);
    }

    res.json(updated);
  } catch (err) {
    console.error('Employee creation error:', err);
    
    // Handle duplicate key (email) errors specifically
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Employee already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE
export const deleteCandidate = async (req, res) => {
  try {
    const cand = await Candidate.findByIdAndDelete(req.params.id);
    if (cand?.resumePublicId) {
      // Clean up Cloudinary file
      await cloudinary.uploader.destroy(cand.resumePublicId, { resource_type: 'raw' });
    }
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DOWNLOAD/OPEN resume (redirect to Cloudinary URL)
export const getResume = async (req, res) => {
   try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Redirect to Cloudinary public URL
    res.redirect(candidate.resumeUrl);
  } catch (err) {
    console.error("❌ Resume download failed:", err);
    res.status(500).json({ message: "Error downloading resume" });
  }
};
