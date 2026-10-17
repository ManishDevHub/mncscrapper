import { Router } from "express";
import { createInterViewRou, deleteRound, updateRound } from "../controller/companyController";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Admin-only interview round management
router.post("/create", authMiddleware, adminMiddleware, createInterViewRou);
router.post("/create/:id", authMiddleware, adminMiddleware, createInterViewRou);
router.post("/update", authMiddleware, adminMiddleware, updateRound);
router.put("/:roundId", authMiddleware, adminMiddleware, updateRound);
router.delete("/delete", authMiddleware, adminMiddleware, deleteRound);
router.delete("/:roundId", authMiddleware, adminMiddleware, deleteRound);

export default router;