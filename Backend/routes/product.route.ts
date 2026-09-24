import { createProduct, deleteProduct, updateProduct } from "../controller/companyController";
import { authMiddleware } from "../middleware/auth.middleware";
import router from "./blog.route";

router.post("/create", authMiddleware , createProduct)
router.post("/product", authMiddleware, updateProduct)
router.delete("/delete" , authMiddleware, deleteProduct)

export default router;