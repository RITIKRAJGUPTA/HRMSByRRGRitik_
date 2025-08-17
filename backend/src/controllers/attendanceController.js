import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// Save attendance
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, taskAssign, status } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const record = new Attendance({
      employee: employee._id,
      name: employee.name,
      position: employee.roleLevel, // or jobTitle
      department: employee.department,
      taskAssign,
      status,
      date: new Date(),
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Error marking attendance", error: err });
  }
};

// Fetch attendance list
export const getAttendance = async (req, res) => {
  try {
    const list = await Attendance.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};
