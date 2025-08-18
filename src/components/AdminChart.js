'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdminChart() {
  const canvasRef = useRef(null);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch('/api/admin/sales-chart');
        const data = await res.json();
        if (res.ok) {
          setSalesData(data);
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      }
    };
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (!salesData || salesData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    const maxSales = Math.max(...salesData.map(d => d.totalSales));
    const xScale = chartWidth / (salesData.length - 1);

    // Draw grid lines and labels
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#9ca3af';

    const yAxisTicks = 5;
    for (let i = 0; i <= yAxisTicks; i++) {
      const y = padding + (chartHeight / yAxisTicks) * i;
      const value = maxSales - (maxSales / yAxisTicks) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      ctx.fillText(`$${(value / 1000).toFixed(1)}k`, 5, y + 4);
    }

    salesData.forEach((dataPoint, i) => {
      const x = padding + i * xScale;
      ctx.fillText(dataPoint.month, x - 10, canvas.height - padding + 20);
    });

    // Draw sales line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    salesData.forEach((dataPoint, i) => {
      const x = padding + i * xScale;
      const y = padding + chartHeight - (dataPoint.totalSales / maxSales) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw data points
    salesData.forEach((dataPoint, i) => {
      const x = padding + i * xScale;
      const y = padding + chartHeight - (dataPoint.totalSales / maxSales) * chartHeight;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [salesData]);

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
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-64"
      />
    </div>
  );
}
