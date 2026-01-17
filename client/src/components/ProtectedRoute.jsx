import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getRole } from '../utils/auth'

export default function ProtectedRoute({ children, requiredRole }){
  const token = getToken()
  const role = getRole()
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" replace />
  return children
}
