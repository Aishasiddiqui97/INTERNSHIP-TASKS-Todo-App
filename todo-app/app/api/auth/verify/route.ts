import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    // Extract token from cookie
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' }, 
        { status: 401 }
      )
    }
    
    // Verify token
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' }, 
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Token is valid',
        user: { email: decoded.email, userId: decoded.userId }
      }, 
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Token verification failed' }, 
      { status: 500 }
    )
  }
}
