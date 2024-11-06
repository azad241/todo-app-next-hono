import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { Context } from 'hono';
import { z } from 'zod';
import { CreateTodoSchema, UpdateTodoSchema } from './db/validator';
import * as crud from './db/crud';
import { cors } from 'hono/cors'

// function to handle multiple data sources
async function parseData(c: Context) {
  const contentType = c.req.header('Content-Type') || '';

  if (contentType.includes('application/json')) {
    return await c.req.json();
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    return await c.req.parseBody();
  }
  return {};
}

const origins = [
  'localhost:3000/',
  'localhost',
  'http://localhost:3000',
];

const app = new Hono() //.basePath('/api');
  .use(
    '*',
    cors({
      origin: origins,
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      exposeHeaders: ["*"],
      maxAge: 600,
      credentials: true,
    })
  )

  // Create a new todo
  .post('/todos', async (c: Context) => {
    try {
      const data = await parseData(c);
      const newTodoData = CreateTodoSchema.parse(data);
      const newTodo = await crud.createTodo(newTodoData);
      return c.json({ message: 'Todo created', todo: newTodo }, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ message: 'Validation failed', errors: error.errors }, 400);
      }
      return c.json({ message: 'Invalid request body' }, 400);
    }
  })

  // Get all todos
  .get('/todos', async (c: Context) => {
    const todos = await crud.getAllTodos();
    return c.json(todos);
  })

  // Get a specific todo by ID
  .get('/todos/:id', async (c: Context) => {
    const { id } = c.req.param();
    const todo = await crud.getTodoById(id);
    if (!todo) return c.json({ message: 'Todo not found' }, 404);
    return c.json(todo);
  })

  // Update a specific todo by ID
  .put('/todos/:id', async (c: Context) => {
    try {
      const data = await parseData(c);
      const updateData = UpdateTodoSchema.parse(data);
      const { id } = c.req.param();
      const updatedTodo = await crud.updateTodo(id, updateData);
      if (!updatedTodo) return c.json({ message: 'Todo not found' }, 404);
      return c.json({ message: 'Todo updated', todo: updatedTodo });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ message: 'Validation failed', errors: error.errors }, 400);
      }
      return c.json({ message: 'Invalid request body' }, 400);
    }
  })

  // Delete a specific todo by ID
  .delete('/todos/:id', async (c: Context) => {
    const { id } = c.req.param();
    const deletedTodo = await crud.deleteTodo(id);
    if (!deletedTodo) return c.json({ message: 'Todo not found' }, 404);
    return c.json({ message: 'Todo deleted', todo: deletedTodo });
  })

  // Delete all todos
  .delete('/todos', async (c: Context) => {
    await crud.deleteAllTodos();
    return c.json({ message: 'All todos have been deleted!' });
  })
  // Catch All Route for undefined routes
  .all('*', (c: Context) => c.json({ message: 'Route not found' }, 404));

export type AppType = typeof app;
// export default app;

const port = 3001
serve({
  fetch: app.fetch,
  port
})