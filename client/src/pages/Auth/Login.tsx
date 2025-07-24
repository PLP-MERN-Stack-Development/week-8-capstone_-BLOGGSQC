import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      // handled in AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Updated credentials to match backend
  const demoCredentials = [
    { role: 'Admin', email: 'admin@edutech-pro.com', password: 'Admin123!' },
    { role: 'Teacher', email: 'sarah.johnson@edutech-pro.com', password: 'Teacher123!' },
    { role: 'Student', email: 'john.smith@student.edutech-pro.com', password: 'Student123!' },
    { role: 'Parent', email: 'robert.smith@parent.edutech-pro.com', password: 'Parent123!' }
  ]

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password })
    toast.success(`Filled ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-2xl mb-6 neon-glow-gold"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your EduTech Pro account</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-8 neon-glow"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 focus:border-primary-500/50 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="glass w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 focus:border-primary-500/50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-500 bg-transparent border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-gold text-white py-3 rounded-xl font-semibold neon-glow-gold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 glass rounded-xl border border-gray-600/30">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-300">Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  className="text-xs text-left p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                >
                  <div className="text-primary-400 font-medium">{cred.role}</div>
                  <div className="text-gray-500 truncate">{cred.email}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <button className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Contact Administrator
            </button>
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <button className="hover:text-gray-400 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-gray-400 transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-gray-400 transition-colors">Support</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
