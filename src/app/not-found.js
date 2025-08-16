"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#56193F] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-8">
            This page is currently under development. We're working hard to bring you something amazing!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-[#56193F] text-white px-6 py-3 rounded-lg hover:bg-[#441530] transition-colors"
          >
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Stay tuned for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
