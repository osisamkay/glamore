"use client";

import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReturnOrderPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [returnReason, setReturnReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const returnReasons = [
    'Item damaged or defective',
    'Wrong size received',
    'Wrong color received',
    'Item not as described',
    'Changed my mind',
    'Quality issues',
    'Other'
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleItemSelection = (itemId, selected) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: selected
    }));
  };

  const handleSubmitReturn = async () => {
    const selectedItemIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    
    if (selectedItemIds.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    if (!returnReason) {
      alert('Please select a reason for return');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          itemIds: selectedItemIds,
          reason: returnReason 
        }),
      });

      if (response.ok) {
        alert('Return request submitted successfully!');
        router.push('/orders/history');
      } else {
        throw new Error('Failed to submit return request');
      }
    } catch (error) {
      console.error('Error submitting return:', error);
      alert('Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Order History
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Return Items</h1>
          <p className="text-gray-600">Order #{order?.id?.slice(-8).toUpperCase()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Select Items to Return</h2>
          
          <div className="space-y-6 mb-8">
            {order?.items?.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems[item.id] || false}
                    onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                    className="w-4 h-4 text-[#56193F] border-gray-300 rounded focus:ring-[#56193F]"
                  />
                </div>
                <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
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
            ))}
          </div>

          {/* Return Reason */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for Return *
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] focus:border-transparent"
            >
              <option value="">Please select a reason</option>
              {returnReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Return Policy Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-blue-900 mb-2">Return Policy</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Items must be returned within 30 days of delivery</li>
              <li>• Items must be in original condition with tags attached</li>
              <li>• Refund will be processed within 5-7 business days</li>
              <li>• Return shipping is free for defective items</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReturn}
              disabled={submitting || Object.keys(selectedItems).filter(id => selectedItems[id]).length === 0 || !returnReason}
              className="px-6 py-2 bg-[#56193F] text-white rounded-md hover:bg-[#441530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
