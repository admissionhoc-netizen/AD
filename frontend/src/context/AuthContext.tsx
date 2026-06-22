import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiFetch } from '../hooks/useApi'

export type UserRole = 'admin' | 'faculty' | 'student'

export interface User {
  id: string
  email: string
  name: string
  full_name?: string
  role: UserRole
  institution?: string
  avatar?: string
}

interface ApiUser {
  id: string
  email: string
  full_name: string
  role?: UserRole
  institution?: string
}

interface AuthResponse {
  access_token: string
  user: ApiUser
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function normalizeUser(apiUser: ApiUser): User {
  const name = apiUser.full_name || apiUser.email
  return {
    id: apiUser.id,
    email: apiUser.email,
    name,
    full_name: apiUser.full_name,
    role: apiUser.role || 'student',
    institution: apiUser.institution,
    avatar: initials(name),
  }
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Authentication failed'
  try {
    const parsed = JSON.parse(error.message)
    if (typeof parsed.detail === 'string') return parsed.detail
    if (Array.isArray(parsed.detail) && parsed.detail[0]?.msg) return parsed.detail[0].msg
  } catch {
    // Use the original message below.
  }
  return error.message || 'Authentication failed'
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
    try {
      const data: AuthResponse = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const nextUser = normalizeUser(data.user)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('adhoc_user', JSON.stringify(nextUser))
      setUser(nextUser)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.name,
        }),
      })
      const newUser = normalizeUser(response.user)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('adhoc_user', JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
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
