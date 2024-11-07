'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit2, Save, X } from 'lucide-react'
import { z } from 'zod'

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast'
import { api_client as api } from '@/lib/client'
import { TodoSchema, UpdateTodoSchema } from '@/hono/db/validator'
import { error } from 'console'

type Todo = z.infer<typeof TodoSchema>
type UpdateTodo = z.infer<typeof UpdateTodoSchema>


export default function TodoComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await (await api.todos.$get()).json();
    const data = response.map((todo: { id: string; title: string; status: string; createdAt: string; updatedAt: string }) => ({
      ...todo,
      status: todo.status as Todo['status'],
    }));
      setTodos(data)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Validation Error",
        description: `Error, ${error}`,
        variant: "destructive",
      })
    }
  }



  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      const data = await (await api.todos.$post({ form: { title: newTodo, status: 'todo' } })).json()
      setNewTodo('')
      fetchTodos()
      toast({
        title: "Success",
        description: `Todo Added, check: ${data}`,
        variant: "default"
      })
      console.log(data)
    } catch (error) {
      toast({
        title: "Validation Error",
        description: `Error, ${error}`,
        variant: "destructive",
      })
    }
  }

  const updateTodo = async (id: string, updates: UpdateTodo) => {
    try {
      await api.todos[':id'].$put({
        param: { id: `${id}` },
        form: updates
      })
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
      await api.todos[':id'].$delete({ param: { id: `${id}` } })
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
      await api.todos.$delete()
      setTodos([])
      toast({
        title: "Warning!",
        description: 'All todos have been deleted!',
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Validation Error",
        description: `Error, ${error}`,
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
      {loading ? (<TodoListLoading />) : (
        <ul className="space-y-2">
          {todos.filter(todo => todo.status === status).map((todo) => (
            <li key={todo.id} className="flex flex-col sm:flex-row items-center gap-2 space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {/* title part */}
              {editingTodo === todo.id ? (
                <Input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  autoFocus
                  className="flex-grow"
                />
              ) : (
                <span className="flex-grow dark:text-gray-200 w-full sm:w-8/12">{todo.title}</span>
              )}
              <div className='flex flex-row sm:flex-auto sm:w-4/12'>
                {/* select part */}
                <div className='w-1/2 px-1'>
                  <Select
                    defaultValue={todo.status}
                    onValueChange={(value) => updateTodo(todo.id, { status: value as Todo['status'] })}
                  >
                    <SelectTrigger className={`${getStatusColor(todo.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* edit part */}
                {editingTodo === todo.id ? (
                  <>
                    <div className='w-1/2 flex flex-row gap-1'>
                      <Button size="icon" onClick={() => saveEdit(todo.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setEditingTodo(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='w-1/2 flex flex-row gap-1'>
                      <Button size="icon" variant="outline" onClick={() => startEditing(todo)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
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

function TodoListLoading() {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {[1, 2, 3, 4, 5].map((index) => (
          <li key={index} className="flex items-center gap-2 space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded animate-pulse">
            <Skeleton className="h-4 w-8/12" />
            <div className="w-2/12 px-1">
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="w-2/12 flex flex-row gap-1">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}