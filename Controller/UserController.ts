import userModel from "../model/userModel";
import express, { Request, Response } from "express";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../Middlewares/ErrorDefiner"
import { AccountVerificationService, forgetPasswordService } from "../utils/emailvit"
import { TokenGenerator } from "../utils/GenerateToken"
import crypto from "crypto";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

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
        message: "user can not be verified",
        status: HTTP.BAD_REQUEST,
        isSuccess:false
    })
    }
})


export const loginUser = asyncHandler(async (req: Request, res: Response) => { 
    try
    {
        const { email, password } = req.body

        if (!email || !password)
        {
            return res.status(HTTP.BAD_REQUEST).json({
                message: "input field can't be empty"
            })

        }

         const checkUser = await userModel.findOne({ email}).exec()
            
            if (checkUser)
            {
                const matchPassword = await checkUser.matchPassword(password)
                if (matchPassword)
                {
                    const { password, ...info } = checkUser._doc
                    
                    const token = TokenGenerator({ info })
                    console.log(token)

                    return res.status(HTTP.OK).json({
                        message: "login success",
                        data: info,
                        token: token
                    })
                    

                    
                } else
                {
                     return res.status(HTTP.BAD_REQUEST).json({ message:"wrong password" })
                }
            } else
            {
                return res.status(HTTP.BAD_REQUEST).json({
                    messeage :"user not found or user has not been been verified"
                })
            }
        
        
    } catch (error)
    {
        new mainAppError({
            name: "an eror occure while logging user",
            message: "uer cannot be loggin",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
  }


})

export const forgetPassword = asyncHandler (async(req:Request, res:Response) => {
    try
    {
        const { email } = req.body
        if (!email)
        {
            return res.status(HTTP.BAD_REQUEST).json({
                message:"input field email is required"
            }) 

        }

        const user = await userModel.findOne({ email }).exec()
        
        if (user)
        {
            const userToken = TokenGenerator({ _id: user._id })
            await userModel.findByIdAndUpdate(
              user._id,
                {
                  tokenResetLink: userToken
                },
                { new: true },
            )
            forgetPasswordService(userToken, user.email, user.name  ).then(() => {
                console.log("message sent")
            })

            return res.status(200).json({
					message: "Please check your email to continue",
            });
            

        } else
            {
                return res.status(HTTP.BAD_REQUEST).json({
                    messeage :"user not found or user has not been been verified"
                })
            }
        
        
    } catch (error)
    {
           new mainAppError({
            name: "an eror occure while trying to send forget paswword link",
            message: "user cannot recieve link",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})

export const resetPassword = asyncHandler(async (req:Request, res:Response) => {
    try
    {
        const { password } = req.body
        if (!password)
        {
            return res.status(HTTP.BAD_REQUEST).json({
                message:"field can't be empty"
            })
        }

        const token = req.params.token
        const decoded = jwt.decode(token);
        console.log(decoded);

        if (token)
        {
            const user = await userModel.findOne({ _id: decoded._id })
            
            if (user?.tokenResetLink !== "")
            {
                const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);
                await userModel.updateOne({
                    password:hashed,
                    token: ""
                })

                return res.status(HTTP.OK).json({
                    message : "updated successfully"
                })
            } else
            {
               return res.status(HTTP.BAD_REQUEST).json({
                nessage :"no token match click on the reset password link to get a new link"
            })  
            }
            
        } else
        {
            return res.status(HTTP.BAD_REQUEST).json({
                nessage :"operation can't be done"
            })
        }


        
    } catch (error)
    {
         new mainAppError({
            name: "an eror occure while trying to reset Password",
            message: "user cannot reset password",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})