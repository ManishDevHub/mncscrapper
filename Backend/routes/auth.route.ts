import Router from "express"
import { signup } from "../controller/authController"
import { login } from "../controller/authController"

const Blogrouter = Router();

Blogrouter.post("/signup" , signup)
Blogrouter.post("/login" , login)

export default Blogrouter