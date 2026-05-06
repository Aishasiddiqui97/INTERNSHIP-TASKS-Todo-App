import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId | undefined
  name: string
  email: string
  password?: string
  createdAt?: Date
}

export interface Task {
  _id?: ObjectId | undefined
  userId: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface TaskResponse {
  success: boolean
  message: string
  task?: Task
  tasks?: Task[]
}
