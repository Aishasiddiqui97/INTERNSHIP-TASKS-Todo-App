import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo App - Secure Task Management',
  description: 'A secure authentication-based to-do application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-primary text-text min-h-screen">
        {children}
      </body>
    </html>
  )
}
