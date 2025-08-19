'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import RefundsView from '@/components/RefundsView'; // This will be created next

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('refunds');

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Returns</h1>
          {/* Add Search and User Profile here if needed */}
        </header>

        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('manage')}
                className={`${activeTab === 'manage' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Manage Returns
              </button>
              <button
                onClick={() => setActiveTab('refunds')}
                className={`${activeTab === 'refunds' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                aria-current={activeTab === 'refunds' ? 'page' : undefined}
              >
                Refunds
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'refunds' ? (
              <RefundsView />
            ) : (
              <div className="text-center text-gray-500">
                <p>Manage Returns view is not yet implemented.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
