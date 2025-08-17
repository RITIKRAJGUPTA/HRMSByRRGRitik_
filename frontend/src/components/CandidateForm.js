// src/components/CandidateForm.js
import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function CandidateForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append("resume", data.resume[0]);

      await api.post("/candidates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Candidate added successfully");
      reset();
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add candidate");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
      {/* Name */}
      <div className="col-md-6">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <small className="text-danger">{errors.name.message}</small>
        )}
      </div>

      {/* Email */}
      <div className="col-md-6">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      {/* Phone */}
      <div className="col-md-6">
        <label className="form-label">Phone</label>
        <input
          type="text"
          className="form-control"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && (
          <small className="text-danger">{errors.phone.message}</small>
        )}
      </div>

      {/* Department */}
      <div className="col-md-6">
        <label className="form-label">Department</label>
        <select
          className="form-select"
          {...register("department", { required: "Department is required" })}
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="Designer">Designer</option>
          <option value="Management">Management</option>
        </select>
        {errors.department && (
          <small className="text-danger">{errors.department.message}</small>
        )}
      </div>

      {/* Role Level */}
      <div className="col-md-6">
        <label className="form-label">Role Level</label>
        <select
          className="form-select"
          {...register("roleLevel", { required: "Role level is required" })}
        >
          <option value="">Select Role Level</option>
          <option value="Intern">Intern</option>
          <option value="Junior">Junior</option>
          <option value="FullTime">FullTime</option>
          <option value="Senior">Senior</option>
        </select>
        {errors.roleLevel && (
          <small className="text-danger">{errors.roleLevel.message}</small>
        )}
      </div>

      {/* Job Title */}
      <div className="col-md-6">
        <label className="form-label">Job Title</label>
        <select
          className="form-select"
          {...register("jobTitle", { required: "Job title is required" })}
        >
          <option value="">Select Job Title</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="HR">HR</option>
        </select>
        {errors.jobTitle && (
          <small className="text-danger">{errors.jobTitle.message}</small>
        )}
      </div>

      {/* Experience */}
      <div className="col-md-6">
        <label className="form-label">Experience (Years)</label>
        <input
          type="number"
          className="form-control"
          {...register("experience", {
            required: "Experience is required",
            min: { value: 0, message: "Must be a positive number" },
          })}
        />
        {errors.experience && (
          <small className="text-danger">{errors.experience.message}</small>
        )}
      </div>

      {/* Resume */}
      <div className="col-md-12">
        <label className="form-label">Resume</label>
        <input
          type="file"
          className="form-control"
          accept=".pdf,.doc,.docx"
          {...register("resume", { required: "Resume file is required" })}
        />
        {errors.resume && (
          <small className="text-danger">{errors.resume.message}</small>
        )}
      </div>

      {/* Submit */}
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Candidate"}
        </button>
      </div>
    </form>
  );
}
