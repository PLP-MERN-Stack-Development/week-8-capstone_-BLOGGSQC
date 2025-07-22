import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-900/20 to-transparent rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full text-sm text-gray-300 mb-8">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span>AI-Powered School Management Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              Educational Institution
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The most advanced cloud-based school management system designed for modern educational institutions. 
            Streamline operations, enhance communication, and improve student outcomes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
        >
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-gold text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 neon-glow-gold group"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 border border-primary-500/30 hover:border-primary-500/50 transition-colors"
          >
            <Play className="h-5 w-5" />
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="glass-strong rounded-2xl p-8 neon-glow">
            {/* Dashboard Preview */}
            <div className="bg-dark-900 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Total Students</span>
                    <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
                  </div>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <div className="text-green-500 text-sm">↑ 12% this month</div>
                </div>
                
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Teachers</span>
                    <div className="w-8 h-8 bg-neon-cyan rounded-lg"></div>
                  </div>
                  <div className="text-2xl font-bold text-white">89</div>
                  <div className="text-blue-500 text-sm">↑ 5% this month</div>
                </div>
                
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Attendance</span>
                    <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                  </div>
                  <div className="text-2xl font-bold text-white">94.2%</div>
                  <div className="text-green-500 text-sm">↑ 2% this week</div>
                </div>
              </div>
              
              {/* Mock Chart */}
              <div className="glass rounded-lg p-4 h-32 flex items-end space-x-2">
                {[40, 65, 45, 80, 55, 70, 85, 60, 90, 75, 95, 85].map((height, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-primary-600 to-primary-400 rounded-t flex-1"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 glass rounded-full p-3 neon-glow"
          >
            <Sparkles className="h-6 w-6 text-primary-500" />
          </motion.div>
          
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 glass rounded-full p-3 neon-glow"
          >
            <div className="w-6 h-6 bg-gradient-gold rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm mb-6">Trusted by leading educational institutions worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            {/* Placeholder for institution logos */}
            <div className="w-24 h-8 glass rounded"></div>
            <div className="w-24 h-8 glass rounded"></div>
            <div className="w-24 h-8 glass rounded"></div>
            <div className="w-24 h-8 glass rounded"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero