import express from "express"
const router = express.Router()

import {registerUser, verifyUser,loginUser, forgetPassword,resetPassword } from "../Controller/UserController"

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/reset").post(forgetPassword)

router.route("/auth/verify/:userToken").get(verifyUser)

router.route("/auth/:token/change-password").patch(resetPassword)
    

export default router;