'use client';

import { useEffect, useRef } from 'react';

export default function AdminChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sample data points for the chart
    const salesData = [
      { x: 50, y: 180 }, { x: 100, y: 160 }, { x: 150, y: 140 }, 
      { x: 200, y: 120 }, { x: 250, y: 100 }, { x: 300, y: 80 },
      { x: 350, y: 60 }, { x: 400, y: 80 }, { x: 450, y: 100 }
    ];
    
    const earningsData = [
      { x: 50, y: 200 }, { x: 100, y: 190 }, { x: 150, y: 170 }, 
      { x: 200, y: 150 }, { x: 250, y: 130 }, { x: 300, y: 110 },
      { x: 350, y: 90 }, { x: 400, y: 110 }, { x: 450, y: 130 }
    ];

    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (canvas.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Sales line (blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    salesData.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw Earnings line (green)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    earningsData.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw data points
    salesData.forEach(point => {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    earningsData.forEach(point => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, []);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
        <div className="flex items-center space-x-4">
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Export Data</option>
          </select>
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Last 14 Days</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Sales</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Earnings</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={250}
        className="w-full h-64"
      />
    </div>
  );
}
