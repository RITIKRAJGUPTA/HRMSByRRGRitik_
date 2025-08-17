// src/pages/Attendance.js
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Attendance() {
  const [taskInput, setTaskInput] = useState("");

  const markAttendance = async (row, status, fetchData) => {
    try {
      await api.post("/attendance", {
        employeeId: row._id,
        taskAssign: taskInput,
        status,
      });
      toast.success("Attendance marked!");
      fetchData();
    } catch {
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <DataTable
      title="Attendance"
      apiEndpoint="/employees"
      columns={[
        { key: "sno", label: "S.N", render: (_, __, idx) => idx + 1 },
        { key: "name", label: "Name" },
        { key: "roleLevel", label: "Position" },
        { key: "department", label: "Department" },
        {
          key: "taskAssign",
          label: "Task Assign",
          render: (_, row) => (
            <input
              type="text"
              className="form-control form-control-sm"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
          ),
        },
        {
          key: "attendance",
          label: "Attendance",
          render: (_, row, idx, fetchData) => (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => markAttendance(row, "Present", fetchData)}
              >
                Present
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => markAttendance(row, "Absent", fetchData)}
              >
                Absent
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}
