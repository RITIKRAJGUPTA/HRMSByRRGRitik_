import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    department: {
      type: String,
      enum: ["HR", "Frontend", "Backend", "Database", "Designer", "Management"],
      required: true,
    },

    roleLevel: {
      type: String,
      enum: ["Intern", "Junior", "FullTime", "Senior"],
      required: true,
    },
     position: {  // Changed from jobTitle
      type: String,
      enum: ["Developer", "Designer", "HR", "Manager"], // Added "Manager"
      required: true,
    },

    dateOfJoining: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
