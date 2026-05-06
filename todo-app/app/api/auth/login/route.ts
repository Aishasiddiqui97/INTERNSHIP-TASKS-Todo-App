import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { compare } from 'bcryptjs'
import { generateToken } from '@/lib/jwt'
import { User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' }, 
        { status: 400 }
      )
    }
    
    // Find user
    const db = await getDb()
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({ email })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' }, 
        { status: 401 }
      )
    }
    
    // Compare passwords
    const isValidPassword = await compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' }, 
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email)
    
    // Set token in HTTP-only cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: { 
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      }, 
      { status: 200 }
    )
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' }, 
      { status: 500 }
    )
  }
}
