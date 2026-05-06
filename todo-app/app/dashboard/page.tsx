"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types/index'
import { TaskResponse } from '@/types/index'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        router.push('/auth/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        if (response.ok) {
          const data = await response.json()
          setTasks(data.tasks || [])
        }
      } catch (err) {
        console.error('Error fetching tasks:', err)
      }
    }
    
    fetchTasks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    
    try {
      setError('')
      setSuccess('')
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, description }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Task created successfully!')
        setTitle('')
        setDescription('')
        
        // Refresh tasks list
        const tasksResponse = await fetch('/api/tasks', { credentials: 'include' })
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          setTasks(tasksData.tasks || [])
        }
      } else {
        setError(data.message || 'Failed to create task')
      }
    } catch (err) {
      setError('An error occurred while creating the task')
      console.error(err)
    }
  }

  const handleToggleStatus = async (taskId: string, currentStatus: 'pending' | 'completed' | undefined) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        // Update local state
        setTasks(tasks.map(task => 
          task._id && task._id.toString() === taskId ? { ...task, status: newStatus } : task
        ))
      }
    } catch (err) {
      console.error('Error updating task status:', err)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (response.ok) {
        // Remove task from local state
        setTasks(tasks.filter(task => task._id && task._id.toString() !== taskId))
      }
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="btn-secondary px-4 py-2 text-sm font-semibold"
        >
          Logout
        </button>
      </div>
      
      {/* Create Task Form */}
      <div className="bg-secondary rounded-xl p-6 mb-8 border border-primary/30">
        <h2 className="text-xl font-semibold mb-4 text-accentSecondary">Add New Task</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title" className="form-label">Task Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full"
              placeholder="Buy groceries"
              required
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input w-full h-24 resize-none"
              placeholder="List of items to buy..."
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary py-2 px-6 mt-4 font-semibold"
          >
            Add Task
          </button>
        </form>
      </div>
      
      {/* Tasks List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-accentSecondary">Your Tasks</h2>
          <span className="text-text/70">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 text-accentSecondary/30">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-text/80">No tasks yet</h3>
            <p className="text-text/60 mb-4">Create your first task to get started!</p>
            <button 
              onClick={() => document.getElementById('title')?.focus()}
              className="btn-primary px-4 py-2"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={String(task._id)} className="task-item flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(task.status ?? 'pending') === 'completed'}
                    onChange={() => handleToggleStatus(String(task._id), task.status ?? 'pending')}
                    className="w-5 h-5 mr-4 text-accent focus:ring-accent"
                  />
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && (
                      <p className="text-text/70 text-sm mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-text/60">
                      <span className="mr-2">{(task.status ?? 'pending') === 'completed' ? '✓ Completed' : '⏳ Pending'}</span>
                      <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggleStatus(String(task._id), task.status ?? 'pending')}
                    className="px-3 py-1 bg-accentSecondary/20 text-accentSecondary rounded hover:bg-accentSecondary/30 transition-colors"
                  >
                    {(task.status ?? 'pending') === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(String(task._id))}
                    className="px-3 py-1 bg-red-500/20 text-red-200 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
