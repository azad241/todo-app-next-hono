import { z } from 'zod';

export const TodoSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title is required").max(300, "Title should be within 300 characters"),
    status: z.enum(["todo", "in-progress", "done"]).default("todo"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export const CreateTodoSchema = TodoSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateTodoSchema = TodoSchema.partial().omit({ createdAt: true, updatedAt: true });
