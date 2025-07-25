import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'

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
  socket: Socket | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  hasPermission: (action: string, resource: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SOCKET'; payload: Socket | null }
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
    case 'SET_SOCKET':
      return { ...state, socket: action.payload }
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        isAuthenticated: false,
        socket: null
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    isAuthenticated: false,
    socket: null
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkAuth(token)
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  useEffect(() => {
    if (state.user && !state.socket) {
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000')

      newSocket.on('connect', () => {
        newSocket.emit('join_room', { room: state.user?.role })
      })

      dispatch({ type: 'SET_SOCKET', payload: newSocket })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [state.user])

  const checkAuth = async (token: string) => {
    try {
      const response = await authAPI.validateToken(token)
      // validateToken should also return {data: {user: {...}}}
      dispatch({ type: 'SET_USER', payload: response.data.user })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // ✅ Role-based permission system
  const hasPermission = (action: string, resource: string): boolean => {
    if (!state.user) return false

    const { role } = state.user
    if (role === 'admin') return true

    const permissions = {
      teacher: {
        read: ['students', 'classes', 'subjects', 'attendance', 'assignments', 'notes', 'announcements', 'calendar', 'analytics'],
        create: ['attendance', 'assignments', 'notes', 'announcements'],
        update: ['attendance', 'assignments', 'notes', 'students'],
        delete: ['assignments', 'notes']
      },
      student: {
        read: ['classes', 'subjects', 'attendance', 'assignments', 'notes', 'announcements', 'calendar'],
        create: ['assignments'],
        update: [],
        delete: []
      },
      parent: {
        read: ['students', 'attendance', 'assignments', 'announcements', 'calendar'],
        create: [],
        update: [],
        delete: []
      }
    }

    return permissions[role]?.[action]?.includes(resource) || false
  }

  // ✅ FIXED LOGIN FUNCTION
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await authAPI.login({ email, password })
      // ✅ Correct destructuring from backend response
      const { user, token } = response.data.data

      localStorage.setItem('token', token)
      dispatch({ type: 'SET_USER', payload: user })

      toast.success(`Welcome back, ${user.name}!`)
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false })
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  // ✅ FIXED REGISTER FUNCTION
  const register = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await authAPI.register(userData)
      // ✅ Correct destructuring from backend response
      const { user, token } = response.data.data

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
    if (state.socket) {
      state.socket.disconnect()
    }
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        hasPermission
      }}
    >
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
