## Case Management App Backend
This backend application provides a RESTful API for managing tasks/cases. 

## API endpoints

GET /api/tasks
Retrieve a list of all tasks.​

GET /api/tasks/:id
Retrieve details of a specific task by ID.​

POST /api/tasks
Create a new task.​

PUT /api/tasks/:id
Update an existing task.​

DELETE /api/tasks/:id
Delete a task.​

## Getting Started

To run the server:

```bash
node server.js
```

## Testing

This app uses Jest for testing

```bash
npm test
```


