// src/pages/Leave.js
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Leave() {
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const markLeave = async (row, fetchData) => {
    if (!fromDate || !toDate) {
      toast.error("Please select From and To date");
      return;
    }

    try {
      await api.post("/leave", {
        attendanceId: row._id,
        reason: reason || "Not specified",
        fromDate,
        toDate,
      });
      toast.success("Leave marked successfully!");
      setReason("");
      setFromDate("");
      setToDate("");
      fetchData();
    } catch {
      toast.error("Failed to mark leave");
    }
  };

  return (
    <div>
      {/* Date Range Inputs */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Reason (optional)"
          className="form-control"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <DataTable
        title="Leave Requests"
        apiEndpoint="/attendance"
        columns={[
          { key: "sno", label: "S.N", render: (_, __, idx) => idx + 1 },
          { key: "name", label: "Name" },
          { key: "department", label: "Department" },
          { key: "taskAssign", label: "Task Assign" },
          { key: "status", label: "Attendance" },
          { key: "date", label: "Date", render: (d) => new Date(d).toLocaleDateString() },
        ]}
        filtersConfig={[
          { key: "status", label: "Filter by Status", options: ["Present"] },
        ]}
        actionsConfig={[
          {
            label: "Mark Leave (Date Range)",
            onClick: (row, fetchData) => markLeave(row, fetchData),
          },
        ]}
      />
    </div>
  );
}
