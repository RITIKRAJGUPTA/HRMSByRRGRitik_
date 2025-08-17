import express from "express";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  getEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get('/',  getEmployee);
router.get("/", getEmployees);
router.post("/", createEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
