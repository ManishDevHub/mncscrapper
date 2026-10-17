"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controller/jobController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes (users and visitors can view jobs)
router.get("/", jobController_1.getAllJobs);
router.get("/getAllJobs", jobController_1.getAllJobs);
router.get("/:id", jobController_1.getJobById);
// Admin-only routes (create, update, delete)
router.post("/create", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, jobController_1.createJob);
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, jobController_1.UpdateJob);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, jobController_1.deleteJob);
exports.default = router;
