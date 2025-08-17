// routes/leave.js
import express from "express";
import { addLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/", addLeave);

export default router;
