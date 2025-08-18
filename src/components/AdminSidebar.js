'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', href: '/admin/dashboard', active: true },
    { name: 'Orders', icon: '📦', href: '/admin/orders' },
    { name: 'Customers', icon: '👥', href: '/admin/customers' },
    { name: 'Products', icon: '🛍️', href: '/admin/products' },
    { name: 'Returns', icon: '↩️', href: '/admin/returns' },
    { name: 'Statistics', icon: '📈', href: '/admin/statistics' },
    { name: 'Tracking', icon: '🚚', href: '/admin/tracking' },
    { name: 'Notifications', icon: '🔔', href: '/admin/notifications' },
    { name: 'Help', icon: '❓', href: '/admin/help' },
    { name: 'Settings', icon: '⚙️', href: '/admin/settings' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <h1 className="text-2xl font-bold text-center">GGF</h1>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm hover:bg-purple-700 transition-colors ${
              pathname === item.href ? 'bg-purple-700 border-r-2 border-white' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-6">
        <Link
          href="/admin/login"
          className="flex items-center text-sm text-purple-200 hover:text-white transition-colors"
        >
          <span className="mr-2">🚪</span>
          Logout
        </Link>
      </div>
    </div>
  );
}
