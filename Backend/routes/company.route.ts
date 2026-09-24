
import { createCompany, createInterViewRou, createProduct, deleteCompany, deleteProduct, deleteRound, getAllCompanies, getCompanyById, updateCompany, updateProduct, updateRound } from "../controller/companyController";
import { authMiddleware } from "../middleware/auth.middleware";
import router from "./blog.route";

router.post("/create" , authMiddleware , createCompany)
router.get("/company", authMiddleware , getAllCompanies)
router.post("/update", authMiddleware, updateCompany)
router.get("/:id" , authMiddleware , getCompanyById)
router.delete("/:id", authMiddleware , deleteCompany)


router.post("/create", authMiddleware , createProduct)
router.post("/product", authMiddleware, updateProduct)
router.delete("/delete" , authMiddleware, deleteProduct)


router.post("/create" , authMiddleware , createInterViewRou);
router.post("/update" , authMiddleware , updateRound)
router.delete("/delete", authMiddleware, deleteRound);


export default router;
