import Employee from "../models/Employee.js";
import Candidate from "../models/Candidate.js";

// Get all employees with optional filters/search
export const getEmployees = async (req, res) => {
  try {
    console.log("Incoming query:", req.query);  // 👀 log it
    const { roleLevel, search, department, position  } = req.query;
    console.log("Filtering by:", { roleLevel, position, department }); 
    let query = {};

    if (roleLevel) query.roleLevel = roleLevel;
    if (department) query.department = department;
    if (position) query.position = position;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    console.log("Mongo query:", query);  // 👀 log the actual query

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err });
  }
};

// Move candidate to employees
export const createEmployee = async (req, res) => {
  try {
    const { candidateId, department } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.status !== "Selected") {
      return res.status(400).json({ message: "Candidate not eligible" });
    }

    const employee = new Employee({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      roleLevel: candidate.roleLevel,
      jobTitle: candidate.jobTitle, // Changed from position
      department: candidate.department,
      status: "Active",
      experience: candidate.experience,
      resumeUrl: candidate.resumeUrl,
      resumePublicId: candidate.resumePublicId,
      dateOfJoining: new Date(),
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", error: err });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};
export const getEmployee = async (req, res) => {
  try {
    const { jobTitle } = req.query;
    const filter = {};

    if (jobTitle) {
      filter.jobTitle = jobTitle; // exact match filter
    }

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
