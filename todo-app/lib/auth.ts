import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './jwt'
import { getDb } from './db'

export async function authenticateRequest(request: NextRequest): Promise<{
  user: any | null;
  error: string | null;
}> {
  const cookies = request.headers.get('cookie') || ''
  
  // Extract token from cookie
  const token = request.cookies.get('token')?.value || ''
  
  if (!token) {
    return { user: null, error: 'No token provided' }
  }
  
  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    return { user: null, error: 'Invalid or expired token' }
  }
  
  try {
    // Get user from database
    const db = await getDb()
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({ email: decoded.email })
    
    if (!user) {
      return { user: null, error: 'User not found' }
    }
    
    // Remove password from user object
    const { password, ...userWithoutPassword } = user
    
    return { user: userWithoutPassword, error: null }
  } catch (error) {
    console.error('Authentication error:', error)
    return { user: null, error: 'Authentication failed' }
  }
}

// Middleware to protect routes
export function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { user, error } = await authenticateRequest(request)
    
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' }, 
        { status: 401 }
      )
    }
    
    return handler(request, user)
  }
}
