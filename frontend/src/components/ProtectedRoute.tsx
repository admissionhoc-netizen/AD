import { Navigate } from 'react-router-dom'
import { useAuth, UserRole } from '../context/AuthContext.tsx'
import { ReactNode } from 'react'

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode
  allowedRoles: UserRole[] 
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />
  }

  return <>{children}</>
}
