import express from "express";
import cors from "cors";

import router from "./routes/auth.route"
import Blogrouter from "./routes/auth.route";
import JobRouter from "./routes/job.route"


const app = express();
app.use
(cors());

app.use(express.json());


app.get("/", ( req:express.Request , res:express.Response ) => {

    res.json({
        message: "hello world"
    })
})

app.use("/api/auth" , router);
app.use("/api/blog" , Blogrouter)
app.use("/api/job", JobRouter)
app.listen(3000 , () => {
    console.log( " server listening on port 3000")
})