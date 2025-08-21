'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminStatsCard from '@/components/AdminStatsCard';
import AdminChart from '@/components/AdminChart';
import AdminTopCategories from '@/components/AdminTopCategories';
import Image from 'next/image';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalSales: 0, visitors: 0, refunds: 0 });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    } else if (user) {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/admin/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };
      fetchStats();
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex  min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4 mt-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Overview
              </button>
              <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                Activity feed
              </button>
              <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                Updates
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/avatar.svg"
                  alt="User avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-700">{user?.firstName || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminStatsCard
            title="Total Sales"
            value={`$${stats.totalSales.toLocaleString()}`}
            change="+2%" // Note: Change calculation is not implemented in the backend yet
            changeType="positive"
            icon="💰"
            color="purple"
          />
          <AdminStatsCard
            title="Visitors"
            value={stats.visitors.toLocaleString()}
            change="+34%" // Note: Change calculation is not implemented in the backend yet
            changeType="positive"
            icon="👥"
            color="green"
          />
          <AdminStatsCard
            title="Refunds"
            value={stats.refunds.toLocaleString()}
            change="-16%" // Note: Change calculation is not implemented in the backend yet
            changeType="negative"
            icon="↩️"
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminChart />
          </div>
          <div>
            <AdminTopCategories />
          </div>
        </div>
      </div>
    </div>
  );
}
