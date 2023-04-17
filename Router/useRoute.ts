import express from "express"
const router = express.Router()

import {registerUser} from "../Controller/UserController"

router.route("/register").post(registerUser)
    

export default router;