import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Task } from '@/types'
import { withAuth } from '@/lib/auth'

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req, user) => {
    try {
      const db = await getDb()
      const tasksCollection = db.collection('tasks')
      
      // Get task by ID and ensure it belongs to current user
      const task = await tasksCollection.findOne({
        _id: new (await import('mongodb')).ObjectId(params.id),
        userId: user._id.toString(),
      })
      
      if (!task) {
        return NextResponse.json(
          { success: false, message: 'Task not found' }, 
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Task retrieved successfully',
          task 
        }, 
        { status: 200 }
      )
      
    } catch (error) {
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch task' }, 
        { status: 500 }
      )
    }
  })(request)
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req, user) => {
    try {
      const { status } = await request.json()
      
      if (!status || !['pending', 'completed'].includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status' }, 
          { status: 400 }
        )
      }
      
      const db = await getDb()
      const tasksCollection = db.collection('tasks')
      
      // Update task and ensure it belongs to current user
      const result = await tasksCollection.updateOne(
        { 
          _id: new (await import('mongodb')).ObjectId(params.id),
          userId: user._id.toString() 
        },
        { 
          $set: { 
            status,
            updatedAt: new Date() 
          } 
        }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Task not found' }, 
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Task updated successfully' 
        }, 
        { status: 200 }
      )
      
    } catch (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update task' }, 
        { status: 500 }
      )
    }
  })(request)
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req, user) => {
    try {
      const db = await getDb()
      const tasksCollection = db.collection('tasks')
      
      // Delete task and ensure it belongs to current user
      const result = await tasksCollection.deleteOne({
        _id: new (await import('mongodb')).ObjectId(params.id),
        userId: user._id.toString(),
      })
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Task not found' }, 
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Task deleted successfully' 
        }, 
        { status: 200 }
      )
      
    } catch (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete task' }, 
        { status: 500 }
      )
    }
  })(request)
}
