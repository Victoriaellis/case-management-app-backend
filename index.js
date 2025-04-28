import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = {
  getAllTasks: async () => {
    return [];
  },

  getTaskById: async (id) => {
    return {
      id,
      title: "Sample Task",
      description: "This is a sample task",
      status: "Complete",
      DueDate: "01/08/2025",
    };
  },

  createTask: async (task) => {
    return { id: 1, ...task };
  },

  updateTask: async (id, task) => {
    return { id, ...task };
  },

  deleteTask: async (id) => {
    return { success: true };
  },
};

app.get("/", async (req, res) => {
  res.send("hello");
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await db.getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const newTask = req.body;
  try {
    const createdTask = await db.createTask(newTask);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;
  try {
    const task = await db.updateTask(id, updatedTask);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.deleteTask(id);
    if (!result.success) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
