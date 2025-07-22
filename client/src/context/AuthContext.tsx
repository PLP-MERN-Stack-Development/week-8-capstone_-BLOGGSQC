import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
  avatar?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      }
    case 'LOGOUT':
      return { 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkAuth(token)
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const checkAuth = async (token: string) => {
    try {
      const response = await authAPI.validateToken(token)
      dispatch({ type: 'SET_USER', payload: response.data.user })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data

      localStorage.setItem('token', token)
      dispatch({ type: 'SET_USER', payload: user })
      toast.success(`Welcome back, ${user.name}!`)
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false })
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.register(userData)
      const { user, token } = response.data

      localStorage.setItem('token', token)
      dispatch({ type: 'SET_USER', payload: user })
      toast.success('Registration successful!')
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false })
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}