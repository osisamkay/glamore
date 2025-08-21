'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function TrackingModal({ order, isOpen, onClose, onTrack }) {
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'track',
          trackingNumber: trackingNumber.trim()
        }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        onTrack(updatedOrder);
        onClose();
      } else {
        console.error('Failed to update tracking number');
      }
    } catch (error) {
      console.error('Error updating tracking number:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Tracking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Order: #{order.id.substring(0, 7)}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Customer: {order.firstName} {order.lastName}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Status: <span className="font-medium">{order.status}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Number *
            </label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter tracking number..."
              required
            />
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Adding a tracking number will automatically update the order status to "Shipped" if currently "Paid".
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={isProcessing || !trackingNumber.trim()}
            >
              {isProcessing ? 'Updating...' : 'Update Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
