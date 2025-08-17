// src/pages/Candidates.js
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import api from "../api/axios";
import { toast } from "react-toastify";
import CandidateForm from "../components/CandidateForm"; // <-- New Form Component

export default function Candidates() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <DataTable
  title="Candidates"
  apiEndpoint="/candidates"
  enableAdd
  renderForm={{
    onOpen: () => setShowForm(true),
    buttonText: "Add Candidate",
  }}
  filtersConfig={[
    {
      key: "status",
      label: "Status",
      options: ["New", "Interview", "Selected", "Rejected"],
    },
    {
      key: "roleLevel",
      label: "Position",
      options: ["Intern", "Junior", "Full Time", "Senior"],
    },
  ]}
  columns={[
    {
      key: "srno",
      label: "S.N.",
      render: (val, row, idx) => String(idx + 1).padStart(2, "0"),
    },
    { key: "name", label: "Candidate Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    { key: "roleLevel", label: "Position" }, 
    {
      key: "status",
      label: "Status",
      render: (val, row) => (
        <select
          className={`form-select form-select-sm ${
            row.status === "Selected"
              ? "border-success"
              : row.status === "Rejected"
              ? "border-danger"
              : ""
          }`}
          style={{ width: 130 }}
          value={row.status}
          onChange={async (e) => {
            try {
              await api.patch(`/candidates/${row._id}`, {
                status: e.target.value,
              });
              toast.success("Status updated");
            } catch {
              toast.error("Failed to update status");
            }
          }}
        >
          <option>New</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
      ),
    },
    { key: "experience", label: "Experience (yrs)" },
  ]}
 actionsConfig={[
  {
    label: "Download Resume",
    onClick: async (row) => {
      try {
        const res = await api.get(`/candidates/${row._id}/resume`, {
          responseType: "blob",
        });

        const fileName =
          res.headers["content-disposition"]?.split("filename=")[1] ||
          "resume.pdf";

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName.replace(/['"]/g, ""));
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        toast.error("Download failed");
      }
    },
    disabled: (row) => !row.resumeUrl,
  },
  {
    label: "Delete Candidate",
    danger: true,
    onClick: async (row, refresh) => {
      // ✅ Show toast confirm instead of window.confirm
      toast.info(
        <div>
          <p>Are you sure you want to delete <b>{row.name}</b>?</p>
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                try {
                  await api.delete(`/candidates/${row._id}`);
                  toast.dismiss(); // close confirm toast
                  toast.success("Candidate deleted");
                  refresh();
                } catch {
                  toast.dismiss();
                  toast.error("Failed to delete candidate");
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
        { autoClose: false } // stays until user clicks
      );
    },
  },
]}

/>


      {/* Candidate Form Modal */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Candidate</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                />
              </div>
              <div className="modal-body">
                <CandidateForm
                  onSuccess={() => {
                    setShowForm(false);
                    window.location.reload(); // refresh list
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
