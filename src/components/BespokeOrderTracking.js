"use client";

import { useState, useEffect } from 'react';

export default function BespokeOrderTracking({ orderId }) {
  const [bespokeItems, setBespokeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchBespokeItems();
    }
  }, [orderId]);

  const fetchBespokeItems = async () => {
    try {
      const response = await fetch(`/api/orders/bespoke?orderId=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setBespokeItems(data.bespokeItems || []);
      }
    } catch (error) {
      console.error('Error fetching bespoke items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'measurements_received': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'quality_check': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'shipped': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending',
      'measurements_received': 'Measurements Received',
      'in_progress': 'In Progress',
      'quality_check': 'Quality Check',
      'completed': 'Completed',
      'shipped': 'Shipped'
    };
    return texts[status] || status;
  };

  const getProgressPercentage = (status) => {
    const progress = {
      'pending': 10,
      'measurements_received': 25,
      'in_progress': 50,
      'quality_check': 75,
      'completed': 90,
      'shipped': 100
    };
    return progress[status] || 0;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (bespokeItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#56193F]/5 to-[#8B5CF6]/5 rounded-lg p-6 border border-[#56193F]/20">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#56193F]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Bespoke Items Progress</h3>
      </div>

      <div className="space-y-4">
        {bespokeItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.color} • Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.bespokeStatus)}`}>
                {getStatusText(item.bespokeStatus)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage(item.bespokeStatus)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#56193F] to-[#8B5CF6] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(item.bespokeStatus)}%` }}
                ></div>
              </div>
            </div>

            {/* Custom Measurements Display */}
            {item.customMeasurements && (
              <div className="bg-gray-50 rounded p-3 mt-3">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Custom Measurements</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {Object.entries(item.customMeasurements).map(([key, value]) => {
                    if (key === 'productName' || key === 'unit' || !value) return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{value} {item.customMeasurements.unit || 'in'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline Steps */}
            <div className="mt-4 flex justify-between text-xs">
              <div className={`text-center ${getProgressPercentage(item.bespokeStatus) >= 10 ? 'text-[#56193F]' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getProgressPercentage(item.bespokeStatus) >= 10 ? 'bg-[#56193F]' : 'bg-gray-300'}`}></div>
                <span>Ordered</span>
              </div>
              <div className={`text-center ${getProgressPercentage(item.bespokeStatus) >= 25 ? 'text-[#56193F]' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getProgressPercentage(item.bespokeStatus) >= 25 ? 'bg-[#56193F]' : 'bg-gray-300'}`}></div>
                <span>Measuring</span>
              </div>
              <div className={`text-center ${getProgressPercentage(item.bespokeStatus) >= 50 ? 'text-[#56193F]' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getProgressPercentage(item.bespokeStatus) >= 50 ? 'bg-[#56193F]' : 'bg-gray-300'}`}></div>
                <span>Crafting</span>
              </div>
              <div className={`text-center ${getProgressPercentage(item.bespokeStatus) >= 75 ? 'text-[#56193F]' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getProgressPercentage(item.bespokeStatus) >= 75 ? 'bg-[#56193F]' : 'bg-gray-300'}`}></div>
                <span>Quality</span>
              </div>
              <div className={`text-center ${getProgressPercentage(item.bespokeStatus) >= 100 ? 'text-[#56193F]' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getProgressPercentage(item.bespokeStatus) >= 100 ? 'bg-[#56193F]' : 'bg-gray-300'}`}></div>
                <span>Shipped</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Estimated completion: 2-3 weeks from order date
        </p>
      </div>
    </div>
  );
}
