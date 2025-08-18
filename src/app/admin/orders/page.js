'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { TruckIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import TailoredOrdersView from '@/components/TailoredOrdersView';
import OrderActionsDropdown from '@/components/OrderActionsDropdown';

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({ status: 'Any Status', search: '' });
  const [sortBy, setSortBy] = useState('date_desc');
  const [activeTab, setActiveTab] = useState('regular');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const query = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        sortBy: sortBy,
        type: activeTab,
      }).toString();

      try {
        const res = await fetch(`/api/admin/orders?${query}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user, filters, sortBy, activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    if (selectedOrder?.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      <main className="flex-1 max-w-[1440px] mx-auto flex gap-8 p-8">
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" name="search" placeholder="Search..." value={filters.search} onChange={handleFilterChange} className="pl-10 pr-4 py-2 border rounded-lg w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/avatar.png" alt="Manager" width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-semibold">Manager name</p>
                  <p className="text-sm text-gray-500">Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs & Filters */}
          <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4 border-b">
              <button 
                onClick={() => setActiveTab('regular')}
                className={`py-2 px-4 font-semibold ${activeTab === 'regular' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>
                Regular Orders
              </button>
              <button 
                onClick={() => setActiveTab('tailored')}
                className={`py-2 px-4 font-semibold ${activeTab === 'tailored' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>
                Tailored Orders
              </button>
            </div>
            <div className="flex items-center gap-4">
              <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded-lg px-4 py-2 bg-white">
                <option>Any Status</option>
                <option>Paid</option>
                <option>Completed</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-lg px-4 py-2 bg-white">
                <option value="date_desc">Sort By Date (Newest)</option>
                <option value="date_asc">Sort By Date (Oldest)</option>
              </select>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'regular' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="pb-4 font-normal"><input type="checkbox" /></th>
                  <th className="pb-4 font-normal">Order</th>
                  <th className="pb-4 font-normal">Customer</th>
                  <th className="pb-4 font-normal">Status</th>
                  <th className="pb-4 font-normal">Total</th>
                  <th className="pb-4 font-normal">Date</th>
                  <th className="pb-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className={`border-t cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gray-100' : ''}`}>
                    <td className="py-4"><input type="checkbox" /></td>
                    <td className="py-4 font-semibold text-gray-800">#{order.id.substring(0, 7)}</td>
                    <td className="py-4 flex items-center gap-2">
                      <Image src={'/images/avatar.png'} alt={`${order.firstName} ${order.lastName}`} width={32} height={32} className="rounded-full" />
                      <span>{order.firstName} {order.lastName}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">${order.total.toFixed(2)}</td>
                    <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <OrderActionsDropdown order={order} onUpdateOrder={handleUpdateOrder} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <TailoredOrdersView orders={orders} selectedOrder={selectedOrder} onSelectOrder={setSelectedOrder} onUpdateOrder={handleUpdateOrder} />
          )}
        </div>

        {/* Order Details Sidebar for Regular Orders */}
        {activeTab === 'regular' && selectedOrder && (
          <div className="w-96 bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id.substring(0, 7)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500">X</button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <Image src={'/images/avatar.png'} alt={`${selectedOrder.firstName} ${selectedOrder.lastName}`} width={64} height={64} className="rounded-full mb-2" />
              <p className="font-semibold">{`${selectedOrder.firstName} ${selectedOrder.lastName}`}</p>
              <div className="flex gap-4 text-gray-500 mt-2">
                <PhoneIcon className="h-5 w-5" />
                <EnvelopeIcon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg" />
                  <div className="flex-1">
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-xl">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center gap-2"><TruckIcon className="h-5 w-5" />Track</button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-2"><ArrowUturnLeftIcon className="h-5 w-5" />Refund</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
