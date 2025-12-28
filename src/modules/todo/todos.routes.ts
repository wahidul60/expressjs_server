import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import express from "express";
import { todosController } from "./todos.controller";
        
const router = express.Router();

router.post("/", todosController.postUser)
router.delete("/:id", todosController.deleteTodos)
router.get("/", todosController.getAllTodos)

export const todoRoutes = router;

