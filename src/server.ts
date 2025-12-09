import express, { NextFunction, Request, Response } from "express"
import { Pool } from "pg";
import dotenv from 'dotenv'
import path from 'path'


const app = express()
const port = 5000

dotenv.config({
  path: path.join(process.cwd(), ".env")
})

app.use(express.json())

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT false,
          due_date DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `)
};

initDB();




app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

//User crud
app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]
    );
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
})

app.get("/allusers", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`)
    console.log(req)
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
})

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
    console.log(req.params.id)
    res.status(201).json({
      success: true,
      message: "successful"
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

})

app.put('/update/:id', async (req: Request, res: Response) => {
  const { name, email } = req.body
  try {
    const result = await pool.query(`UPDATE users SET name = $1, email=$2 WHERE id=$3 RETURNING*`, [name, email, req.params.id]);

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

})

app.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [req.params.id]);
    console.log(result.rowCount)
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
})

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
        success : false,
        Message : "Data not found"
      })
    }else{
      res.status(201).json({
        success : true,
        message : "Data deleted",
        data : result.rows
      })
    }

  } catch (err: any) {
      res.status(404).json({
        success : false, 
        message : err.message,
        data : result.rows
      })
  }
})

const logger = (req : Request, res : Response, next : NextFunction)=> {
  console.log(`Date : ${new Date().toISOString()}`);
  next()
}

app.get("/logger", logger, (req, res)=>{
  res.send(`${logger} hello wahidul this is loger middleware function`)
})

app.use((req, res)=>{  
  res.status(404).json({
    success : false,
    message : "route not found",
    path : req.path
  })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
