import { Router } from "express";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controller/companyController";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes (users and visitors can view companies)
router.get("/", getAllCompanies);
router.get("/company", getAllCompanies);
router.get("/:id", getCompanyById);

// Admin-only routes (create, update, delete)
router.post("/create", authMiddleware, adminMiddleware, createCompany);
router.put("/:id", authMiddleware, adminMiddleware, updateCompany);
router.post("/update", authMiddleware, adminMiddleware, updateCompany);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCompany);

export default router;
