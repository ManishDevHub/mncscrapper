
import { Router } from "express";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controller/companyController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllCompanies);
router.get("/company", getAllCompanies);
router.get("/:id", getCompanyById);
router.post("/create", authMiddleware, createCompany);
router.put("/:id", authMiddleware, updateCompany);
router.post("/update", authMiddleware, updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;

