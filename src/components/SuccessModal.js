"use client";

import { useEffect } from 'react';

export default function SuccessModal({ isOpen, onClose, title = "Success!", message = "Your account has been created." }) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">GlamourGlow Fashion</h1>
        </div>

        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{backgroundColor: '#56193f', borderColor: '#56193f'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3d1230'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#56193f'}
        >
          Continue
        </button>
      </div>
    </div>
  );
}