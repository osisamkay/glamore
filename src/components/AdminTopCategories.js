'use client';

import { useEffect, useRef } from 'react';

export default function AdminTopCategories() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Data for the donut chart
    const data = [
      { label: "Women's Tops", value: 45, color: '#8b5cf6' },
      { label: "Men's Accessories", value: 30, color: '#a855f7' },
      { label: "Women's Accessories", value: 25, color: '#c084fc' }
    ];
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    // Draw donut segments
    data.forEach(segment => {
      const sliceAngle = (segment.value / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius - 30, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
    
    // Draw center text
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$4.5k', centerX, centerY - 5);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Total Sales', centerX, centerY + 15);
    
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
      
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="mb-4"
        />
        
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Women's Tops</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Men's Accessories</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Women's Accessories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
