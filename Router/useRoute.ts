import express from "express"
const router = express.Router()

import {registerUser, verifyUser} from "../Controller/UserController"

router.route("/register").post(registerUser)
router.route("/auth/verify/:userToken").get(verifyUser)
    

export default router;