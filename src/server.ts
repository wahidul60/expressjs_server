import express, { Request, Response } from "express"
import { Pool } from "pg";
import dotenv from 'dotenv'
import path from 'path'


const app = express()
const port = 5000

dotenv.config({
  path: path.join(process.cwd(), ".env")
})

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

app.use(express.json())


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

//User crud
app.post('/user', async (req: Request, res: Response) => {
  const { name, email } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]
    );
    res.status(201).json({
      success: true,
      message: "message sent"
    })
  } catch (err: any) {
    res.status(500).json({
      successful: false,
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
      message : "successful"
    })
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message : err.message
    })
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
