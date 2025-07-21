import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'from-neon-blue to-neon-blue/80',
    green: 'from-neon-green to-neon-green/80',
    purple: 'from-neon-purple to-neon-purple/80',
    orange: 'from-gold-500 to-gold-400',
    red: 'from-neon-pink to-neon-pink/80',
  }

  return (
    <div className="glass-card hover:scale-105 transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-neon-green mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-neon-pink mr-1" />
              )}
              <span className={clsx(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-neon-green' : 'text-neon-pink'
              )}>
                {trend.value}%
              </span>
              <span className="text-sm text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-lg glow-${color}`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatCard