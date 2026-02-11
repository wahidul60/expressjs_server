import express from "express"
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todos.routes";
import { authRoute } from "./modules/auth/auth.routes";

const app = express()

//request.body not idefined
app.use(express.json()) 

initDB();

//main route
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);
app.use("/auth", authRoute)

//default route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path
  })
})

export default app;