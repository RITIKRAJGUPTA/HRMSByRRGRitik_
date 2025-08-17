// src/components/DataTable.js
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function DataTable({
  title = "Data Table",
  apiEndpoint,
  columns,
  filtersConfig = [],
  actionsConfig = [],
  enableAdd = false,
  renderForm,
}) {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(apiEndpoint, { params: filters });
      setList(data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters]);

  const handleAction = async (action, row) => {
    try {
      await action.onClick(row, fetchData);
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="container-fluid">
      {/* ===== Top Heading Row ===== */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0">{title}</h4>

        {/* Profile Dropdown - stays top right */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <span className="me-2">👤</span> Profile
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item">Edit Profile</button>
            </li>
            <li>
              <button className="dropdown-item">Change Password</button>
            </li>
            <li>
              <button className="dropdown-item">Manage Notifications</button>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== Filters + Add Button Row ===== */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* Left side filters */}
        <div className="d-flex gap-2">
          {filtersConfig.map((f) => (
            <select
              key={f.key}
              className="form-select form-select-sm"
              style={{ width: 160 }}
              value={filters[f.key] || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) =>
  typeof opt === "object" ? (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ) : (
    <option key={opt} value={opt}>
      {opt}
    </option>
  )
)}

            </select>
          ))}
        </div>

        {/* Right side Add Button */}
        {enableAdd && renderForm && (
          <button
            className="btn btn-primary btn-sm"
            onClick={renderForm.onOpen}
          >
            {renderForm.buttonText || "Add New"}
          </button>
        )}
      </div>

      {/* ===== Table ===== */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="table-dark">
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {actionsConfig.length > 0 && <th className="text-end">Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4">
                    Loading…
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                list.map((row, idx) => (
                  <tr key={row._id}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(row[col.key], row, idx)
                          : row[col.key]}
                      </td>
                    ))}
                    {actionsConfig.length > 0 && (
                      <td className="text-end">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="dropdown"
                          >
                            ⋮
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            {actionsConfig.map((a) => (
                              <li key={a.label}>
                                <button
                                  className={`dropdown-item ${
                                    a.danger ? "text-danger" : ""
                                  }`}
                                  onClick={() => handleAction(a, row)}
                                  disabled={a.disabled?.(row)}
                                >
                                  {a.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
