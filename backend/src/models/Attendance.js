import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    name: { type: String, required: true },
    position: { type: String },   // jobTitle or roleLevel, your choice
    department: { type: String },
    taskAssign: { type: String },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
