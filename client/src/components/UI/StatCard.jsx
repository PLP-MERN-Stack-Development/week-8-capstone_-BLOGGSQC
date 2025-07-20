import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={clsx(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx(
          'h-12 w-12 rounded-lg flex items-center justify-center',
          colorClasses[color].split(' ')[2]
        )}>
          <Icon className={clsx(
            'h-6 w-6',
            colorClasses[color].split(' ')[1]
          )} />
        </div>
      </div>
    </div>
  )
}

export default StatCard