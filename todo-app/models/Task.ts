import { Schema, model, models } from 'mongoose'

interface Task {
  userId: string
  title: string
  description: string
  status: 'pending' | 'completed'
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<Task>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Export the Task model
const Task = models.Task || model<Task>('Task', taskSchema)

export default Task
