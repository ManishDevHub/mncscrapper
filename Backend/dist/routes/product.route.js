"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controller/companyController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin-only product management
router.post("/create", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.createProduct);
router.post("/create/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.createProduct);
router.put("/:productId", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.updateProduct);
router.delete("/:productId", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.deleteProduct);
router.delete("/delete", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, companyController_1.deleteProduct);
exports.default = router;
