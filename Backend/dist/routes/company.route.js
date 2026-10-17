"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controller/companyController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes (users and visitors can view companies)
router.get("/", companyController_1.getAllCompanies);
router.get("/company", companyController_1.getAllCompanies);
router.get("/:id", companyController_1.getCompanyById);
// Admin-only routes (create, update, delete)
router.post("/create", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.createCompany);
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.updateCompany);
router.post("/update", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.updateCompany);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.deleteCompany);
exports.default = router;
