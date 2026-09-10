import express from "express";
import cors from "cors";


const app = express();
app.use
(cors());

app.use(express.json());

app.get("/", ( req:express.Request , res:express.Response ) => {

    res.json({
        message: "hello world"
    })
})

app.listen(3000 , () => {
    console.log( " server listening on port 3000")
})