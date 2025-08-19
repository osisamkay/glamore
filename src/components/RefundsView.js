'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RefundsView() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/admin/returns');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
          if (data.length > 0) {
            setSelectedRequest(data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch return requests:', error);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleUpdateRequest = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/returns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedRequest = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
        if (selectedRequest?.id === id) {
          setSelectedRequest(updatedRequest);
        }
      }
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} refund:`, error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading refunds...</div>;
  }

  const selectedItem = selectedRequest?.items[0]?.orderItem;

  return (
    <div className="flex gap-8">
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between border-b pb-2 mb-2 font-semibold text-gray-600">
          <span>Order</span>
          <span>Status</span>
        </div>
        <ul className="space-y-1 h-[60vh] overflow-y-auto">
          {requests.map(req => (
            <li 
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className={`flex justify-between p-2 rounded-md cursor-pointer ${selectedRequest?.id === req.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
              <span className="font-medium text-gray-800">#{req.orderId.substring(0, 7)}</span>
              <span className={`text-sm font-semibold ${req.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{req.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 bg-white rounded-lg shadow-md p-8">
        {selectedRequest && selectedItem ? (
          <div className="flex gap-8">
            <div className="w-1/2">
              <Image 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                width={300} 
                height={300} 
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center">
              <p className="text-sm text-gray-500">{selectedItem.category || 'Caps'}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">{selectedItem.name}</h2>
              <p className="text-xl font-semibold text-gray-900 my-3">${selectedItem.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><b>Colour:</b> {selectedItem.color}</p>
              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                <p><b>Quantity:</b> {selectedItem.quantity}</p>
                <p><b>Size:</b> {selectedItem.size}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => handleUpdateRequest(selectedRequest.id, 'Rejected')}
                  className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400"
                  disabled={selectedRequest.status !== 'Pending'}
                >
                  Reject Refund
                </button>
                <button 
                  onClick={() => handleUpdateRequest(selectedRequest.id, 'Approved')}
                  className="flex-1 bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition-colors disabled:bg-gray-400"
                  disabled={selectedRequest.status !== 'Pending'}
                >
                  Approve Refund
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a return request to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
