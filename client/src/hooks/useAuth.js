import { useState, useEffect, createContext, useContext } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Simulate API call - replace with actual API call
      setTimeout(() => {
        setUser({
          _id: '1',
          firstName: 'John',
          lastName: 'Admin',
          email: 'admin@school.com',
          role: 'admin',
          phone: '+1234567890',
          createdAt: new Date().toISOString()
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      // Simulate API call - replace with actual API call
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            _id: '1',
            firstName: 'John',
            lastName: 'Admin',
            email: credentials.email,
            role: credentials.email.includes('admin') ? 'admin' : 
                  credentials.email.includes('teacher') ? 'teacher' : 
                  credentials.email.includes('student') ? 'student' : 'parent',
            phone: '+1234567890',
            createdAt: new Date().toISOString()
          }
        }
      }
      
      localStorage.setItem('token', mockResponse.data.token)
      setUser(mockResponse.data.user)
      return mockResponse
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully!')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    setUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}