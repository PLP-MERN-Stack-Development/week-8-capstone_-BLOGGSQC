const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  }

  const colorClasses = {
    blue: 'border-neon-blue',
    white: 'border-white',
    gray: 'border-gray-400',
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <div 
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} glow-blue`}
      ></div>
      <div className="text-center">
        <p className="text-white font-medium">Loading...</p>
        <p className="text-gray-400 text-sm">Please wait</p>
      </div>
    </div>
  )
}

export default LoadingSpinner