import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body
    try {
        const result = await userService.createUser(name, email);
        res.status(201).json({
            success: true,
            message: "user created"
        })
    } catch (err: any) {
        res.status(500).json({
            successful: false,
            message: err.message
        })
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUser();
        res.status(200).json({
            success: true,
            message: "all users shown below",
            data: result.rows
        })
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUserById(req.params.id as string);

        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "user not fatched"
            })
        } else {
            res.status(201).json({
                success: true,
                message: "data fetched successfully",
                data: result.rows
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const updateUserById = async (req: Request, res: Response) => {
    const { name, email } = req.body
    try {
        const result = await userService.updateUserById(name, email, req.params.id as string);

        if (result.rows.length === 0) {
            res.status(201).json({
                success: false,
                message: "data not found"
            })
        } else {
            res.status(201).json({
                success: true,
                message: "updated successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUserById(req.params.id as string) ;   
    if (result.rowCount === 0) {
      res.status(404).json({
        successful: false,
        message: "data not found"
      })
    } else {
      res.status(201).json({
        success: true,
        message: "deleted successfully"
      })

    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message
    })
  }
}

export const userControllers = {
    createUser, getUser, getUserById, updateUserById, deleteUserById
}
