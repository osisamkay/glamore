"use client";

import Image from 'next/image';

export default function SizeChartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-3xl w-full">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Size Guide For Men</h3>
        <div className="w-full">
          <Image 
            src="/size-chart.png" 
            alt="Size Chart for Men"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
