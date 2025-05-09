import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./database/index.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY due_date ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.get("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, complete, due_date } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  if (complete !== undefined && typeof complete !== "boolean") {
    return res.status(400).json({ message: "Complete must be a boolean" });
  }

  if (due_date && isNaN(Date.parse(due_date))) {
    return res
      .status(400)
      .json({ message: "Due date must be a valid date string" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, complete, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, complete ?? false, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" }, error);
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { complete } = req.body;

  if (complete !== undefined && typeof complete !== "boolean") {
    return res.status(400).json({ message: "Complete must be a boolean" });
  }

  try {
    const result = await pool.query(
      `UPDATE tasks SET complete = $1 WHERE id = $2 RETURNING *`,
      [complete, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default app;
