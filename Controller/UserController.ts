import userModel from "../model/userModel";
import express, { Request, Response } from "express";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../Middlewares/ErrorDefiner"
import { AccountVerificationService } from "../utils/emailvit"
import { TokenGenerator } from "../utils/GenerateToken"
import crypto from "crypto";
import jwt from "jsonwebtoken"
export const  registerUser = asyncHandler(async (req:Request, res:Response) => {
    try
    {
            const { name, email, password } = req.body;

            if (!email || !password || !name)
            {
                return res.status(400).json({mesage:"please enter all field"})
            }

            const usesExist = await userModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
        }
        
        
        const token = TokenGenerator({ name, email, password })
        
        console.log(token)
         const OTP = crypto.randomBytes(2).toString("hex");

        AccountVerificationService(token, name, OTP, email).then((result) => {
            return res.status(HTTP.OK).json({
                message: `check email ${email} to verify account`,
                result: result
            })
        }).catch((err) => {
					return res.status(HTTP.MOT_FOUND).json(err);
		});
                
        

    } catch (error)
    {
        new mainAppError({
            name: "Error creating user",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})


export const verifyUser = asyncHandler(async (req:Request, res:Response) => {
    try
    {
        const token = req.params.userToken
        if (token)
        {
            jwt.verify(token, "thisisthesecrect", async (error, decoded) => {
                if (error)
                {
                    return res.status(HTTP.BAD_REQUEST).json({
                        message:"verification link expire on invalid token"
                    })
                    
                } else
                {
                    const { name, email, password } = jwt.decode(token)
                    
                    await userModel.create({
                        name,
                        email,
                        password,
                    })
                   return  res.status(HTTP.OK).json({
                        message: "Verification success, go and Login.",
                    })
                    
                }
            })


        } else
        {
            return res.status(HTTP.BAD_REQUEST).json({
                message:"no permission to access this token"
            })
        }

        
    } catch (error){
    new mainAppError({
        name: "error in verifing user",
        message: "auser can not be verified",
        status: HTTP.BAD_REQUEST,
        isSuccess:false
    })
    }
})