'use client';

export default function AdminStatsCard({ title, value, change, changeType, icon, color }) {
  const getColorClasses = (color) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 border-purple-200';
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses(color)} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${getChangeColor(changeType)}`}>
              {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last week</span>
          </div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
