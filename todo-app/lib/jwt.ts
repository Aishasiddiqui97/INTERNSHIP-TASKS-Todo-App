import { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'

interface JwtPayload {
  userId: string
  email: string
}

export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = { userId, email }
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE,
  }
  return sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

export const getTokenFromCookie = (cookies: string): string | null => {
  if (!cookies) return null
  
  const cookieArray = cookies.split(';')
  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'token') {
      return value
    }
  }
  return null
}
