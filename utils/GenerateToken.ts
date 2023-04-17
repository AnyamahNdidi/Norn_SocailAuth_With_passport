import jwt from "jsonwebtoken"

export const TokenGenerator = (data:any) => {
    return jwt.sign(data, "thisisthesecrect", {expiresIn:"2d"})
}