import express, { Request, Response } from "express"
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
const router = express.Router()

router.post("/", userControllers.createUser)
router.get("/", auth("user"), userControllers.getUser)
router.get("/:id", userControllers.getUserById)
router.put("/:id", userControllers.updateUserById)
router.delete("/:id", userControllers.deleteUserById)


export const userRoutes = router;