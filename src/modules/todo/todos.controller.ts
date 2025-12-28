import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todosServices } from "./todos.service";

const postUser = async (req: Request, res: Response) => {
  
    const { title, user_id } = req.body;

  try {
    const result = await todosServices.addTodos(title, user_id);
    res.status(201).json({
      success: true,
      messaage: "created todos",
      data: result.rows
    })
  } catch (err: any) {
    res.status(201).json({
      success: false,
      message: err.message
    })
  }
}

const deleteTodos = async (req: Request, res: Response) => {
  const result = await todosServices.deleteToodos(req.params.id as string);
  try {
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        Message: "Data not found"
      })
    } else {
      res.status(201).json({
        success: true,
        message: "Data deleted",
        data: result.rows
      })
    }

  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
      data: result.rows
    })
  }
}

const getAllTodos = async (req: Request, res : Response) => {
  const result = await pool.query(`SELECT * FROM todos`)
  console.log(result.rows)
  try{
    res.status(201).json({
      successful : true, 
      message : result.rows,      

    })
    
  }catch(err:any){
    res.status(404).json({
      successful : false,
      message : "data not found try again"
    })
  }
}


export const todosController = {
    postUser, deleteTodos, getAllTodos
}
