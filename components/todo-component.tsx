'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit2, Save, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast'

interface Todo {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
}

interface ApiError {
  message: string
  errors?: Array<{
    message: string
    path: string[]
  }>
}

export default function TodoComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const response = await fetch('/api/todos')
    const data = await response.json()
    setTodos(data)
  }
  
  const handleApiError = (error: ApiError) => {
    if (error.errors && error.errors.length > 0) {
      const errorMessages = error.errors.map(err => err.message).join(', ')
      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      })
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, status: 'todo' }),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        handleApiError(errorData)
        return
      }

      setNewTodo('')
      fetchTodos()
      toast({
        title: "Success",
        description: 'Todo Added',
        variant: "default"
      })
    } catch {
      toast({
        title: "Error",
        description: 'An error occurred while adding the todo',
        variant: "destructive",
      })
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        handleApiError(errorData)
        return
      }

      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      ))
      toast({
        title: "Success",
        description: 'Todo has been updated',
        variant: "default",
      })
    } catch {
      toast({
        title: "Error",
        description: 'An error occurred while updating the todo',
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        handleApiError(errorData)
        return
      }

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
      toast({
        title: "Success",
        description: 'Todo has been deleted',
        variant: "destructive",
      })
    } catch {
      toast({
        title: "Error",
        description: 'An error occurred while deleting the todo',
        variant: "destructive",
      })
    }
  }

  const deleteAllTodos = async () => {
    try {
      const response = await fetch('/api/todos', { method: 'DELETE' })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        handleApiError(errorData)
        return
      }

      setTodos([])
      toast({
        title: "Warning!",
        description: 'All todo has been deleted!',
        variant: "destructive",
      })

    } catch {
      toast({
        title: "Error",
        description: 'An error occurred while deleting all todos',
        variant: "destructive",
      })
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id)
    setEditText(todo.title)
  }

  const saveEdit = async (id: string) => {
    await updateTodo(id, { title: editText })
    setEditingTodo(null)
  }

  const getStatusColor = (status: Todo['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in-progress':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'done':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  }

  const TodoList = ({ status }: { status: Todo['status'] }) => (
    <>
    <ul className="space-y-2">
      {todos.filter(todo => todo.status === status).map((todo) => (
        <li key={todo.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          {/* title part */}
          {editingTodo === todo.id ? (
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-grow"
            />
          ) : (
            <span className="flex-grow dark:text-gray-200">{todo.title}</span>
          )}
          {/* select part */}
          <Select
            defaultValue={todo.status}
            onValueChange={(value) => updateTodo(todo.id, { status: value as Todo['status'] })}
          >
            <SelectTrigger className={`w-[130px] ${getStatusColor(todo.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          {/* edit part */}
          {editingTodo === todo.id ? (
            <>
              <Button size="icon" onClick={() => saveEdit(todo.id)}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setEditingTodo(null)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="outline" onClick={() => startEditing(todo)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </li>
      ))}
    </ul>
    </>
  )

  return (
    <>
     <form onSubmit={addTodo} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow dark:bg-gray-700 dark:text-gray-100"
          />
          <Button type="submit">Add</Button>
        </form>

        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todo">Todo</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="todo">
            <TodoList status="todo" />
          </TabsContent>
          <TabsContent value="in-progress">
            <TodoList status="in-progress" />
          </TabsContent>
          <TabsContent value="done">
            <TodoList status="done" />
          </TabsContent>
        </Tabs>

        {todos.length > 0 && (
          <Button variant="destructive" className="mt-4" onClick={deleteAllTodos}>
            Delete All Todos
          </Button>
        )}
    </>
  )
}