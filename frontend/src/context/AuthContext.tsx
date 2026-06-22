import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'admin' | 'faculty' | 'student'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  institution?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface SignupData {
  name: string
  email: string
  password: string
  role: UserRole
  institution?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for immediate testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@gcedu.in': {
    password: 'Admin@1234',
    user: {
      id: '1',
      email: 'admin@gcedu.in',
      name: 'Dr. Anika Rao',
      role: 'admin',
      institution: 'GC Educational Trust',
      avatar: 'AR',
    },
  },
  'faculty@gcedu.in': {
    password: 'Faculty@1234',
    user: {
      id: '2',
      email: 'faculty@gcedu.in',
      name: 'Prof. Vikram Mehta',
      role: 'faculty',
      institution: 'GC Educational Trust',
      avatar: 'VM',
    },
  },
  'student@gcedu.in': {
    password: 'Student@1234',
    user: {
      id: '3',
      email: 'student@gcedu.in',
      name: 'Priya Sharma',
      role: 'student',
      institution: 'GC Educational Trust',
      avatar: 'PS',
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('adhoc_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const demoUser = DEMO_USERS[email.toLowerCase()]
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user)
      localStorage.setItem('adhoc_user', JSON.stringify(demoUser.user))
    } else {
      throw new Error('Invalid credentials')
    }
    setIsLoading(false)
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email: data.email,
      name: data.name,
      role: data.role,
      institution: data.institution,
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    }

    setUser(newUser)
    localStorage.setItem('adhoc_user', JSON.stringify(newUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adhoc_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}