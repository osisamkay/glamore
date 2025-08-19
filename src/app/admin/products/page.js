'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import Image from 'next/image';


const ManageInventoryView = ({ products }) => (
  <div className="bg-white rounded-lg shadow-sm mt-6">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">SKU</th>
          <th scope="col" className="px-6 py-3">Name</th>
          <th scope="col" className="px-6 py-3">Total QTY</th>
          <th scope="col" className="px-6 py-3">Buy Price</th>
          <th scope="col" className="px-6 py-3">Sell Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.sku}</td>
            <td className="px-6 py-4">{product.name}</td>
            <td className="px-6 py-4">{product.totalQty}</td>
            <td className="px-6 py-4">{`$${product.buyPrice.toFixed(2)}`}</td>
            <td className="px-6 py-4">{`$${product.sellPrice.toFixed(2)}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Manage Inventory');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    } else if (user) {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/admin/products');
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error('Failed to fetch products');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
      fetchProducts();
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 w-full max-w-[1440px] mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/avatar.svg"
                  alt="User avatar"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-700">{user?.firstName || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('Manage Inventory')}
              className={`${activeTab === 'Manage Inventory' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Inventory
            </button>
            <button
              onClick={() => setActiveTab('Item Groups')}
              className={`${activeTab === 'Item Groups' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Item Groups
            </button>
            <button
              onClick={() => setActiveTab('Price List')}
              className={`${activeTab === 'Price List' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Price List
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'Manage Inventory' && <ManageInventoryView products={products} />}
          {activeTab === 'Item Groups' && <div className="text-center p-8 bg-white rounded-lg shadow-sm">Item Groups content goes here.</div>}
          {activeTab === 'Price List' && <div className="text-center p-8 bg-white rounded-lg shadow-sm">Price List content goes here.</div>}
        </div>
      </div>
    </div>
  );
}
