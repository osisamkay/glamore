"use client";

import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReviewOrderPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        // Initialize reviews object
        const initialReviews = {};
        data.order.items?.forEach(item => {
          initialReviews[item.id] = {
            rating: 5,
            comment: ''
          };
        });
        setReviews(initialReviews);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleRatingChange = (itemId, rating) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating
      }
    }));
  };

  const handleCommentChange = (itemId, comment) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  const handleSubmitReviews = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews }),
      });

      if (response.ok) {
        alert('Reviews submitted successfully!');
        router.push('/orders/history');
      } else {
        throw new Error('Failed to submit reviews');
      }
    } catch (error) {
      console.error('Error submitting reviews:', error);
      alert('Failed to submit reviews. Please try again.');
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
          <h1 className="text-2xl font-semibold text-gray-900">Write Reviews</h1>
          <p className="text-gray-600">Order #{order?.id?.slice(-8).toUpperCase()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Rate Your Items</h2>
          
          <div className="space-y-8">
            {order?.items?.map((item) => (
              <div key={item.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start space-x-4 mb-4">
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
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(item.id, star)}
                        className={`w-8 h-8 ${
                          star <= (reviews[item.id]?.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={reviews[item.id]?.comment || ''}
                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] focus:border-transparent"
                    placeholder="Share your thoughts about this item..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitReviews}
              disabled={submitting}
              className="px-6 py-2 bg-[#56193F] text-white rounded-md hover:bg-[#441530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Reviews'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
