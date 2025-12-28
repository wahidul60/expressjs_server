import express, { Request, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todos.routes";
import { authRoute } from "./modules/auth/auth.routes";

const app = express()
const port = config.Port;

app.use(express.json())
initDB();
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);
app.use("/auth", authRoute)


app.get("/logger", logger, (req, res) => {
  res.send(`${logger} hello wahidul this is loger middleware function`)
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
