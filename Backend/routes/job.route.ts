import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getJobById, UpdateJob } from "../controller/jobController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllJobs);
router.get("/getAllJobs", getAllJobs);
router.get("/:id", getJobById);
router.post("/create", authMiddleware, createJob);
router.put("/:id", authMiddleware, UpdateJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;