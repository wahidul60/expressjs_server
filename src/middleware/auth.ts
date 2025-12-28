import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config";

const auth = (...role : string[] ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;            
            if (!token) {
                return (res.status(200).json({ message: "unsuccessful login" }))
            }
            const decode = jwt.verify(token, config.jwtSecret as string)
            console.log(decode)
            req.user = decode as JwtPayload;
            next();
        } catch (err: any) {
            res.status(404).json({
                message : "error"
            })
        }
    };

}

export default auth;