// src/pages/Employees.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <>
      <DataTable
        title="Employees"
        apiEndpoint="/employees"
        columns={[
          {
            key: "sn",
            label: "S.N",
            render: (val, row, idx) => String(idx + 1).padStart(2, "0"),
          },
          { key: "name", label: "Employee Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone Number" },
          { key: "roleLevel", label: "Position" },
          { key: "position", label: "Position" },
          { key: "department", label: "Department" },
          {
            key: "dateOfJoining",
            label: "Date of Joining",
            render: (val) => new Date(val).toLocaleDateString(),
          },
        ]}
        actionsConfig={[
          {
            label: "Edit Employee",
            onClick: (row) => {
              setSelectedEmployee(row);
            },
          },
          {
            label: "Delete Employee",
            danger: true,
            onClick: async (row, refresh) => {
              // ✅ Toastify confirmation instead of window.confirm
              toast.info(
                <div>
                  <p>
                    Are you sure you want to delete{" "}
                    <b>{row.name}</b> from employees?
                  </p>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        try {
                          await api.delete(`/employees/${row._id}`);
                          toast.dismiss();
                          toast.success("Employee deleted successfully");
                          refresh();
                        } catch {
                          toast.dismiss();
                          toast.error("Failed to delete employee");
                        }
                      }}
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toast.dismiss()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>,
                { autoClose: false } // keep open until HR chooses
              );
            },
          },
        ]}
      />

      {/* Edit Employee Modal */}
      {selectedEmployee && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedEmployee(null)}
                />
              </div>
              <div className="modal-body">
                <EmployeeForm
                  employee={selectedEmployee}
                  onSuccess={() => {
                    setSelectedEmployee(null);
                    window.location.reload();
                  }}
                  onClose={() => setSelectedEmployee(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
