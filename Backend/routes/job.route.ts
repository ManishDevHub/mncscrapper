import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getJobById, UpdateJob } from "../controller/jobController";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes (users and visitors can view jobs)
router.get("/", getAllJobs);
router.get("/getAllJobs", getAllJobs);
router.get("/:id", getJobById);

// Admin-only routes (create, update, delete)
router.post("/create", authMiddleware, adminMiddleware, createJob);
router.put("/:id", authMiddleware, adminMiddleware, UpdateJob);
router.delete("/:id", authMiddleware, adminMiddleware, deleteJob);

export default router;