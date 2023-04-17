import express, { Application, NextFunction, Request, Response } from "express";
import { HTTP, mainAppError } from "./Middlewares/ErrorDefiner"
import cors from "cors";
import passport from "passport";
import { errorHandler } from "./Middlewares/ErrorHandler"
import userRouter from "./Router/useRoute"

export const mainApp = (app:Application) => {
    app.use(express.json())
        .use(cors())
        .use("/api", userRouter )
        .get("/", (req: Request, res: Response) => {
            
            res.status(HTTP.OK).json({
                message:"api is ready"
            })
        
        })
        .get("/api/ejs::id", (req: Request, res: Response) => {
            
             const id = req.params.id
             const name = "edwin"
            return res.render("AccountVerification",{id, name})
        })
    .use(errorHandler)

}