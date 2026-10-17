"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controllr_1 = require("../controller/blog.controllr");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes (users and visitors can view blogs)
router.get("/", blog_controllr_1.getAllBlogs);
router.get("/:id", blog_controllr_1.getBlogById);
// Admin-only blog management
router.post("/create", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, blog_controllr_1.createBlog);
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, blog_controllr_1.updateBlog);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, blog_controllr_1.deleteBlog);
exports.default = router;
