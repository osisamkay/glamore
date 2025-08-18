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
    <div className={`p-6 rounded-lg border  ${getColorClasses(color)} hover:shadow-md transition-shadow`}>
      <div className="">
        <div>
          <div className="flex items-center mb-4   space-x-2">
        <div className="text-xl">{icon}</div>
          <p className="text-xl font-medium text-gray-600 mb-1">{title}</p>
          </div>
          <p className="text-2xl mb-4 font-bold text-gray-900">{value}</p>
          <div className="flex flex-1 items-center w-full justify-between mt-2">
            <span className={`text-sm ${getChangeColor(changeType)}`}>
              {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
