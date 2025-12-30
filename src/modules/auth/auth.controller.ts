import { Request, Response } from "express";
import { authServices } from "./auth.services";

const loginUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const result = await authServices.loginUser(email, password, role)
       
        res.status(200).json({
            success: true,
            message: "login successfully",
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            successful: false,
            message: err.message
        })
    }
}

export const authControler = {
    loginUser
}