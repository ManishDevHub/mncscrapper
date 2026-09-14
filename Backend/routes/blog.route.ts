import Router from "express"
import { createBlog, getAllBlogs, getBlogById, updateBlog,deleteBlog } from "../controller/blog.controllr";
import { authMiddleware as AuthMiddleware } from "../middleware/auth.middleware";



const router = Router();

router.post("/create" , AuthMiddleware,createBlog)
router.get("/",AuthMiddleware, getAllBlogs)
router.get("/:id",AuthMiddleware, getBlogById)
router.put("/:id" ,AuthMiddleware, updateBlog)
router.delete("/:id" ,AuthMiddleware, deleteBlog)


export default router;
