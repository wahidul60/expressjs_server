import { pool } from "../../config/db";

const addTodos = async (title: string, user_id: string) => {
    const result = await pool.query(`INSERT INTO todos(title, user_id) VALUES($1, $2) RETURNING *`, [title, user_id]);
    return result;
}
const deleteToodos = async (id: string) => {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING*`, [id]);
    return result;
}

export const todosServices = {
    addTodos, deleteToodos
}