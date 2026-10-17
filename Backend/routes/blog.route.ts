import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "../controller/blog.controllr";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/create", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;

