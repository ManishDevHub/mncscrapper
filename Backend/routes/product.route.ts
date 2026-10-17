import { Router } from "express";
import { createProduct, deleteProduct, updateProduct } from "../controller/companyController";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Admin-only product management
router.post("/create", authMiddleware, adminMiddleware, createProduct);
router.post("/create/:id", authMiddleware, adminMiddleware, createProduct);
router.put("/:productId", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:productId", authMiddleware, adminMiddleware, deleteProduct);
router.delete("/delete", authMiddleware, adminMiddleware, deleteProduct);

export default router;