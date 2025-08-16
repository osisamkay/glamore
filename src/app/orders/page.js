"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccountSidebar from '../../components/AccountSidebar';

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReorder = (orderId) => {
    // TODO: Implement reorder functionality
    console.log('Reorder:', orderId);
  };

  const handleCancelOrder = (orderId) => {
    // TODO: Implement cancel order functionality
    console.log('Cancel order:', orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AccountSidebar />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Pending Orders</h1>

            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No pending orders found</div>
                <p className="text-gray-400">Your pending orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ${order.total?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-orange-600 font-medium">
                          {order.status || 'Pending'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="text-sm text-gray-500 space-y-1">
                              {item.color && <div>Colour: {item.color}</div>}
                              {item.size && <div>Size: {item.size}</div>}
                              <div>Quantity: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )) || (
                        <div className="text-gray-500">No items found</div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleReorder(order.id)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Reorder
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
