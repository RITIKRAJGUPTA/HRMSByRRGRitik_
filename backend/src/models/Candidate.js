import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    // Department (HR, Frontend, Backend, Database, Designer, etc.)
    department: {
      type: String,
      enum: ["HR", "Frontend", "Backend", "Database", "Designer", "Management"],
      required: true,
    },

    // Candidate position (level + jobTitle)
    roleLevel: {
      type: String,
      enum: ["Intern", "Junior", "FullTime", "Senior"],
      required: true,
    },
    jobTitle: {
      type: String,
      enum: ["Developer", "Designer", "HR"],
      required: true,
    },

    status: {
      type: String,
      enum: ["New", "Interview", "Selected", "Rejected"],
      default: "New",
    },

    experience: { type: Number, required: true },

    // Resume Info
    resumeUrl: { type: String, required: true },
    resumePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
