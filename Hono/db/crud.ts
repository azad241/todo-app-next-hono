import { db } from './db';
import { todos } from './schema';
import { CreateTodoSchema, UpdateTodoSchema } from './validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getAllTodos = async () => {
    return await db.select().from(todos);
};

export const getTodoById = async (id: string) => {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    return todo || null;
};

export const createTodo = async (data: z.infer<typeof CreateTodoSchema>) => {
    const newTodo = {
        id: crypto.randomUUID(),
        title: data.title,
        status: data.status || 'todo'
    };
    await db.insert(todos).values(newTodo);
    return newTodo;
};

export const updateTodo = async (id: string, data: z.infer<typeof UpdateTodoSchema>) => {
    const updatedData = {
        ...data
    };
    await db.update(todos).set(updatedData).where(eq(todos.id, id));
    return getTodoById(id);
};

export const deleteTodo = async (id: string) => {
    const deletedTodo = await getTodoById(id);
    if (deletedTodo) {
        await db.delete(todos).where(eq(todos.id, id));
    }
    return deletedTodo;
};

export const deleteAllTodos = async () => {
    await db.delete(todos);
};
