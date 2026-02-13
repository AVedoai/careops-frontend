/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuthStore } from '../../lib/stores/auth'
import { authApi, workspaceApi } from '../../lib/api'
import type { User } from '../../lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { 
    email: string; 
    password: string; 
    businessName: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    user, 
    isLoading, 
    isAuthenticated,
    setUser, 
    setWorkspace, 
    logout: storeLogout,
    initialize
  } = useAuthStore()
  
  const [loading, setLocalLoading] = useState(false)

  useEffect(() => {
    initialize()
    
    // Load workspace if user is authenticated
    if (isAuthenticated && user) {
      loadWorkspace()
    }
  }, [])

  const loadWorkspace = async () => {
    try {
      const response = await workspaceApi.getCurrent()
      if (response.success && response.data) {
        setWorkspace(response.data)
      }
    } catch (error) {
      console.error('Failed to load workspace:', error)
    }
  }

  const login = async (email: string, password: string) => {
    setLocalLoading(true)
    try {
      const response = await authApi.login(email, password)
      if (response.success && response.data) {
        setUser(response.data.user)
        await loadWorkspace()
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLocalLoading(false)
    }
  }

  const register = async (data: { 
    email: string; 
    password: string; 
    businessName: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setLocalLoading(true)
    try {
      const response = await authApi.register(data)
      if (response.success && response.data) {
        setUser(response.data.user)
        // No need to load workspace here as it should be created during registration
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLocalLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    storeLogout()
  }

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading: isLoading || loading,
        login,
        register,
        logout,
        isAuthenticated,
      }
    },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}