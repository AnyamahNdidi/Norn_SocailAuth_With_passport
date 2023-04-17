import { Request, Response, NextFunction } from "express"
import {mainAppError, HTTP} from "./ErrorDefiner"


const errorBuilder = (err: mainAppError, res: Response) => {
    return  res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        message: err.message,
        status: HTTP.BAD_REQUEST,
        stack: err.stack
    })
};

export const errorHandler = (
    err: mainAppError,
    req: Request,
    res: Response
) => {
    errorBuilder(err, res)
}