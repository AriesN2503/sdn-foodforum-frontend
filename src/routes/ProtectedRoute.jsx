"use client"

import { Navigate, useLocation } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { checkRole } from "../utils/auth"
import { useEffect } from "react"
import { useToast } from "../components/ui/use-toast"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated && requiredRole && !checkRole(user?.role, requiredRole)) {
      toast({
        title: "Access Denied",
        description: `You need ${requiredRole} permissions to access this page.`,
        variant: "destructive",
      })
    }
  }, [isAuthenticated, user, requiredRole, toast])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based permission
  if (requiredRole && !checkRole(user?.role, requiredRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
