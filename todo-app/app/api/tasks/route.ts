import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Task } from '@/types'
import { withAuth } from '@/lib/auth'

// GET /api/tasks - Get all tasks for current user
export async function GET(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const db = await getDb()
      const tasksCollection = db.collection('tasks')
      
      // Get tasks for current user
      const tasks = await tasksCollection
        .find({ userId: user._id.toString() })
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Tasks retrieved successfully',
          tasks 
        }, 
        { status: 200 }
      )
      
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch tasks' }, 
        { status: 500 }
      )
    }
  })(request)
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const { title, description } = await request.json()
      
      if (!title || title.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'Task title is required' }, 
          { status: 400 }
        )
      }
      
      // Validate user has _id
      if (!user._id) {
        console.error('User _id is missing:', user)
        return NextResponse.json(
          { success: false, message: 'Authentication failed: user ID missing' }, 
          { status: 401 }
        )
      }
      
      const db = await getDb()
      const tasksCollection = db.collection('tasks')
      
      const newTask: Task = {
        userId: user._id.toString(),
        title: title.trim(),
        description: description?.trim(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const result = await tasksCollection.insertOne(newTask)
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Task created successfully',
          task: { ...newTask, _id: result.insertedId.toString() }
        }, 
        { status: 201 }
      )
      
    } catch (error) {
      console.error('Error creating task:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to create task' }, 
        { status: 500 }
      )
    }
  })(request)
}
