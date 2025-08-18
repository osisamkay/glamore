'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdminTopCategories() {
  const canvasRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const res = await fetch('/api/admin/top-categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch top categories:', error);
      }
    };
    fetchTopCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    const totalQuantity = categories.reduce((sum, cat) => sum + cat._sum.quantity, 0);
    if (totalQuantity === 0) return;

    const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];
    let currentAngle = -Math.PI / 2;

    categories.forEach((segment, index) => {
      const sliceAngle = (segment._sum.quantity / totalQuantity) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius - 30, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      currentAngle += sliceAngle;
    });

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${totalQuantity}`, centerX, centerY - 5);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Total Items', centerX, centerY + 15);

  }, [categories]);

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
          {categories.map((cat, index) => {
            const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];
            return (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <span className="text-sm text-gray-600">{cat.category}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{cat._sum.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
