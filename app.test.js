import request from "supertest";
import app from "./app.js";
import pool from "./database/index.js";

afterAll(async () => {
  await pool.end();
});

let createdTaskId;

describe("POST /api/tasks", () => {
  it("should create a new task", async () => {
    const newTask = {
      title: "Test Task",
      description: "This is a test",
      complete: false,
      due_date: "2025-05-01",
    };

    const res = await request(app).post("/api/tasks").send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    createdTaskId = res.body.id;
  });
});

describe("GET /api/tasks", () => {
  it("should return an array of tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("PUT /api/tasks/:id", () => {
  it("should update the 'complete' field of a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({ complete: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.complete).toBe(true);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("should delete the task", async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(204);
  });

  it("should return 404 for deleted task", async () => {
    const res = await request(app).get(`/api/task/${createdTaskId}`);
    expect(res.statusCode).toBe(404);
  });
});
