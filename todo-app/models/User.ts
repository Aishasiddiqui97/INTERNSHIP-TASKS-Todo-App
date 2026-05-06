import { Schema, model, models } from 'mongoose'

interface User {
  name: string
  email: string
  password: string
  createdAt: Date
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Export the User model
const User = models.User || model<User>('User', userSchema)

export default User
