import express from "express"
import { login, logout, me } from "../controllers/auth.controller.js"
import protect from "../middleware/protect.js"

const authRouter=express.Router()

authRouter.post("/login",login)

authRouter.post("/logout",logout)

authRouter.get("/me",protect,me)

export default authRouter
