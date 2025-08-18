'use client';

import { useState, useRef, useEffect } from 'react';
import { EllipsisVerticalIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const OrderActionsDropdown = ({ order, onUpdateOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        onUpdateOrder(updatedOrder);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setIsOpen(false);
    setIsStatusMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="text-gray-500 hover:text-gray-700">
        <EllipsisVerticalIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Package</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Confirm Order</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancel Order</a>
            <div 
              onMouseEnter={() => setIsStatusMenuOpen(true)}
              onMouseLeave={() => setIsStatusMenuOpen(false)}
              className="relative"
            >
              <button className="w-full text-left flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Change Status
                <ChevronRightIcon className="h-4 w-4" />
              </button>
              {isStatusMenuOpen && (
                <div className="absolute left-full top-0 mt-[-0.25rem] w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {['Pending', 'Paid', 'Sent To Production', 'Delivered', 'Completed', 'Returned', 'Cancelled'].map(status => (
                      <a 
                        key={status}
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleStatusChange(status); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {status}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActionsDropdown;
