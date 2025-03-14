import React from 'react'

const StatCard = ({ title, value, icon: Icon, color = 'blue', description }) => {
  const getColorClass = (color) => {
    const colorClasses = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600'
      },
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-600'
      },
      secondary: {
        bg: 'bg-secondary-50',
        text: 'text-secondary-600'
      }
    }
    
    return colorClasses[color] || colorClasses.blue
  }
  
  const colorClass = getColorClass(color)
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${colorClass.bg} ${colorClass.text}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

export default StatCard