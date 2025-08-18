'use client';

import React from 'react';

const TailoredOrdersView = ({ orders, selectedOrder, onSelectOrder, onUpdateOrder }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600';
      case 'sent to production': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleSendToProduction = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Sent To Production' }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        onUpdateOrder(updatedOrder);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Orders List */}
      <div className="w-1/3 border-r pr-6">
        <div className="flex justify-between items-center pb-2 border-b mb-2">
          <h2 className="font-semibold">Order</h2>
          <h2 className="font-semibold">Status</h2>
        </div>
        <ul className="space-y-1">
          {orders.map(order => (
            <li 
              key={order.id} 
              onClick={() => onSelectOrder(order)}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
              <span className="font-medium text-gray-800">#{order.id.substring(0, 7)}</span>
              <span className={`text-sm font-medium ${getStatusClass(order.status)}`}>{order.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Details */}
      <div className="flex-1">
        {selectedOrder ? (
          <div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
              <div>
                <p className="font-semibold text-gray-600 mb-1">Name:</p>
                <p className="text-gray-800">{`${selectedOrder.firstName} ${selectedOrder.lastName}`}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Date:</p>
                <p className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Email:</p>
                <p className="text-gray-800">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Time:</p>
                <p className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Phone No:</p>
                <p className="text-gray-800">{selectedOrder.phone}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="font-semibold text-gray-600 mb-1">Notes:</p>
              <p className="text-gray-800 text-sm">
                {selectedOrder.items.find(item => item.customMeasurements)?.customMeasurements || 'No custom measurements provided.'}
              </p>
            </div>
            <button 
              onClick={handleSendToProduction}
              className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition-colors disabled:bg-gray-400"
              disabled={selectedOrder.status === 'Sent To Production'}
            >
              {selectedOrder.status === 'Sent To Production' ? 'Sent To Production' : 'Send To Production'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select an order to see details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailoredOrdersView;
