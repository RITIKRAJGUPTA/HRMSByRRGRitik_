// controllers/leave.js
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

export const addLeave = async (req, res) => {
  try {
    const { attendanceId, reason, fromDate, toDate } = req.body;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    const leave = new Leave({
      employee: attendance.employee,
      name: attendance.name,
      department: attendance.department,
      taskAssign: attendance.taskAssign,
      reason,
      fromDate,
      toDate,
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: "Error creating leave", error: err });
  }
};
