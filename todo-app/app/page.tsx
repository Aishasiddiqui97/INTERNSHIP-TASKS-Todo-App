"use client"

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
          Todo App
        </h1>
        <p className="text-xl mb-8 text-text/80">
          A secure, modern to-do application with authentication
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/auth/register" 
            className="btn-primary px-6 py-3 text-lg font-semibold"
          >
            Get Started
          </Link>
          <Link 
            href="/auth/login" 
            className="btn-secondary px-6 py-3 text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
        
        <div className="bg-secondary rounded-lg p-6 border border-primary/30">
          <h2 className="text-2xl font-semibold mb-4 text-accentSecondary">
            Features
          </h2>
          <ul className="text-left space-y-2 text-text/70">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Secure JWT Authentication
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Password Hashing with bcrypt
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              User-Specific Task Management
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Modern Turquoise & Blue Theme
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
