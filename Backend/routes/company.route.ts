
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controller/companyController";
import { authMiddleware } from "../middleware/auth.middleware";
import router from "./blog.route";

router.post("/create" , authMiddleware , createCompany)
router.get("/company", authMiddleware , getAllCompanies)
router.post("/update", authMiddleware, updateCompany)
router.get("/:id" , authMiddleware , getCompanyById)
router.delete("/:id", authMiddleware , deleteCompany)

export default router;
