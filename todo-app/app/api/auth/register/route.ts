import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'
import { hash } from 'bcryptjs'
import { User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' }, 
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' }, 
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const db = await getDb()
    const usersCollection = db.collection('users')
    const existingUser = await usersCollection.findOne({ email })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' }, 
        { status: 409 }
      )
    }
    
    // Hash password
    const saltRounds = 12
    const hashedPassword = await hash(password, saltRounds)
    
    // Create user
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }
    
    const result = await usersCollection.insertOne(newUser)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: { ...newUser, _id: result.insertedId.toString() }
      }, 
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Registration error:', error)
    // In development, expose more detail for debugging
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Registration failed'
    return NextResponse.json(
      { success: false, message: errorMessage }, 
      { status: 500 }
    )
  }
}