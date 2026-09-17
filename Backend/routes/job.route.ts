 import { createJob, deleteJob, getAllJobs, getJobById, UpdateJob } from "../controller/jobController";
import { authMiddleware } from "../middleware/auth.middleware";
import router from "./blog.route";

 router.post("/create" , authMiddleware , createJob);
 router.get("/getAllJobs" , authMiddleware , getAllJobs);
 router.get("/:id", authMiddleware , getJobById );
 router.put("/:id" , authMiddleware , UpdateJob);
 router.delete("/:id" , authMiddleware , deleteJob)

 export default router;