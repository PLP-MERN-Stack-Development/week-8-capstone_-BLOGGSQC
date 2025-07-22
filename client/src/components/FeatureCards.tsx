import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  MessageCircle, 
  Shield, 
  Smartphone,
  Clock,
  Globe
} from 'lucide-react'

const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student profiles, enrollment tracking, and academic progress monitoring',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Advanced curriculum management, grade tracking, and assessment tools',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Real-time reporting, performance analytics, and predictive insights',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Communication Hub',
      description: 'Seamless communication between teachers, students, and parents',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'GDPR & FERPA compliant with advanced security and privacy controls',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Fully responsive design with native mobile app experience',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Instant notifications and live data synchronization across all devices',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Cloud-based platform accessible from anywhere in the world',
      color: 'from-pink-500 to-purple-500'
    },
  ]

  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprehensive School Management Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to run a modern educational institution efficiently and effectively
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 group hover:neon-glow transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-500 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards