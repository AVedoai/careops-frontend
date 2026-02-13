import { api } from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  workspace_name: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    is_active: boolean
    role: 'owner' | 'staff'
    workspace: {
      id: number
      name: string
      slug: string
      is_active: boolean
    }
  }
}

export interface User {
  id: number
  email: string
  is_active: boolean
  role: 'owner' | 'staff'
  workspace: {
    id: number
    name: string
    slug: string
    is_active: boolean
  }
}

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response = await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    // Store token
    localStorage.setItem('careops-token', response.data.access_token)
    
    return response.data
  },

  // Register new user with workspace
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/v1/auth/register', data)
    
    // Store token
    localStorage.setItem('careops-token', response.data.access_token)
    
    return response.data
  },

  // Get current user info
  me: async (): Promise<User> => {
    const response = await api.get('/api/v1/auth/me')
    return response.data
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('careops-token')
    window.location.href = '/login'
  },

  // Check if user has token
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('careops-token')
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('careops-token')
  },
}