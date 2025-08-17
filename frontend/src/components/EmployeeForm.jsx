// src/components/EmployeeForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EmployeeForm({ employee, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    dateOfJoining: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        jobTitle: employee.jobTitle || "",
        department: employee.department || "",
        dateOfJoining: employee.dateOfJoining
          ? employee.dateOfJoining.split("T")[0]
          : "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/employees/${employee._id}`, formData);
      toast.success("Employee updated successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to update employee");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Position</label>
        <select
          name="roleLevel"
          value={formData.jobTitle}
          onChange={handleChange}
          className="form-select"
        >
          <option>Intern</option>
          <option>Junior</option>
          <option>FullTime</option>
          <option>Senior</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="form-select"
        >
          <option>HR</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Database</option>
          <option>Designer</option>
          <option>Management</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Date of Joining</label>
        <input
          name="dateOfJoining"
          type="date"
          value={formData.dateOfJoining}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}
