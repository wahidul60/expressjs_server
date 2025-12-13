import express, { Request, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express()
const port = config.Port;

app.use(express.json())
initDB();
app.use("/users", userRoutes);



app.post("/todos", async (req: Request, res: Response) => {
  const { title, user_id } = req.body;
  console.log(req.body)
  try {
    const result = await pool.query(`INSERT INTO todos(title, user_id) VALUES($1, $2) RETURNING *`, [title, user_id])
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
})

app.delete("/deletetodo/:id", async (req: Request, res: Response) => {
  const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING*`, [req.params.id])
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
})

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
