# Full Stack Todo Application

A modern, full-stack todo application built with Next.js, Hono.js, Drizzle ORM, and other cutting-edge technologies. This application demonstrates best practices in full-stack development, including type safety, API validation, and modern UI components.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI and Tailwind
- **React Hook Form** - Performant, flexible forms with validation

### Backend
- **Hono.js** - Lightweight, ultrafast web framework
- **Drizzle ORM** - TypeScript ORM with great developer experience
- **SQLite** - Simple, robust database
- **Zod** - TypeScript-first schema validation

## Prerequisites

Make sure you have the following installed:
- Node.js 18.x or later
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/azad241/todo-app-next-hono
```

2. Install dependencies:
```bash
bun install --legacy-peer-deps
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DB_FILE_NAME=file:local.db
```

4. Generate database schema:
```bash
npx drizzle-kit generate:sqlite
```

5. Apply database migrations:
```bash
npx drizzle-kit push:sqlite
```

6. Start the development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## Features

- ✅ Create, Read, Update, and Delete todos
- ✅ Mark todos as complete
- ✅ Filter todos by status
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Type-safe API calls
- ✅ Data validation
- ✅ Optimistic updates
- ✅ Error handling

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create a new todo |
| PUT | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |
| DELETE | /api/todos | Delete all todos |
