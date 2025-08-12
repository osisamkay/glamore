"use client";

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send the email to a backend service
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-lg font-medium mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-xs text-gray-600 mb-4">Stay updated with the latest products and exclusive offers</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200"
              required
            />
            <button 
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          {subscribed && (
            <p className="text-green-600 mt-2 text-xs font-medium">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
