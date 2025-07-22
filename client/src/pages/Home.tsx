import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  Play,
  Check
} from 'lucide-react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import FeatureCards from '../components/FeatureCards'

const Home: React.FC = () => {
  const stats = [
    { number: '50K+', label: 'Students Managed' },
    { number: '2K+', label: 'Schools Using' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ]

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student profiles with academic tracking and parent communication'
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Advanced grading system with AI-powered analytics and performance insights'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Interactive dashboards with predictive analytics and custom reporting'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'GDPR & FERPA compliant with advanced encryption and access controls'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with sub-2-second load times and offline support'
    },
    {
      icon: GraduationCap,
      title: 'Smart Learning',
      description: 'AI-powered recommendations and personalized learning pathways'
    },
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal, Westfield Academy',
      content: 'EduTech Pro transformed our school administration. The efficiency gains are remarkable.',
      avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Mark Thompson',
      role: 'IT Director, Metro School District',
      content: 'The most comprehensive school management system we\'ve ever used. Highly recommended.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Lisa Chen',
      role: 'Mathematics Teacher',
      content: 'Student engagement has increased significantly since implementing EduTech Pro.',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation />
      <Hero />

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center glass rounded-2xl p-6"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureCards />

      {/* Detailed Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Manage Your School
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive features designed by educators, for educators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-8 hover:neon-glow transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Educational Leaders
            </h2>
            <p className="text-gray-400 text-lg">
              See what educators are saying about EduTech Pro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-12 neon-glow-gold"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of educational institutions already using EduTech Pro to streamline their operations and improve student outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-gold text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 neon-glow-gold group"
                >
                  <span>Get Started Today</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 border border-primary-500/30"
              >
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
            
            <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Free 30-day trial
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                24/7 support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-gold rounded-xl flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduTech Pro</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 EduTech Pro. All rights reserved.</p>
              <p className="text-sm mt-1">Empowering education through technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home