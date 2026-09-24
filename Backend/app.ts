import express from "express";
import cors from "cors";

import router from "./routes/auth.route"
import Blogrouter from "./routes/auth.route";
import JobRouter from "./routes/job.route"
import companyRouter from "./routes/company.route"
import productRouter from "./routes/product.route"
import roundRouter from "./routes/round.route"

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
app.use("/company", companyRouter)
app.use("company/product" ,productRouter )
app.use("company/round" , roundRouter)
app.listen(3000 , () => {
    console.log( " server listening on port 3000")
})