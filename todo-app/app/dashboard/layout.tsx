import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const token = cookies().get('token')?.value
  
  if (!token) {
    // Redirect to login if no token
    redirect('/auth/login')
  }
  
  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    // Redirect to login if token is invalid or expired
    redirect('/auth/login')
  }
  
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
