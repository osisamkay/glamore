"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { href: '/orders', label: 'Pending Orders', active: pathname === '/orders' },
    { href: '/orders/paid', label: 'Paid Orders', active: pathname === '/orders/paid' },
    { href: '/orders/history', label: 'Order History', active: pathname === '/orders/history' },
    { href: '/profile/info', label: 'My Information', active: pathname === '/profile/info' },
    { href: '/profile/measurements', label: 'My Measurement Profiles', active: pathname === '/profile/measurements' },
    { href: '/profile/addresses', label: 'My Addresses', active: pathname === '/profile/addresses' },
    { href: '/profile/favorites', label: 'My Favorites', active: pathname === '/profile/favorites' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Welcome Section */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          Welcome Customer
        </h2>
        <p className="text-sm text-gray-600">{user?.firstName || 'name'}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-3 text-sm rounded-md transition-colors ${
                  item.active
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
