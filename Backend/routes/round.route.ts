import { createInterViewRou, deleteRound, updateRound } from "../controller/companyController";
import { authMiddleware } from "../middleware/auth.middleware";
import router from "./blog.route";



router.post("/create" , authMiddleware , createInterViewRou);
router.post("/update" , authMiddleware , updateRound)
router.delete("/delete", authMiddleware, deleteRound);

export default router