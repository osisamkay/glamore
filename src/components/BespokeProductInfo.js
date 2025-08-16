"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CustomMeasurementModal from './CustomMeasurementModal';

export default function BespokeProductInfo({ product, onShowSizeGuide }) {
  // Handle colors that may be arrays or comma-separated strings
  const availableColors = Array.isArray(product.colors) 
    ? product.colors 
    : (product.colors ? product.colors.split(',') : [product.color || 'Black']);
  
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState(null);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSaveMeasurements = (measurements) => {
    setCustomMeasurements(measurements);
    console.log('Custom measurements saved:', measurements);
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // For bespoke items, check if measurements are provided
    if (!customMeasurements) {
      alert('Please provide custom measurements for this bespoke item.');
      setShowMeasurementModal(true);
      return;
    }

    setIsAddingToCart(true);
    const itemToAdd = {
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      color: selectedColor || "Purple",
      size: 'Custom',
      quantity: quantity,
      bespoke: true,
      customMeasurements: customMeasurements,
    };

    const success = await addToCart(itemToAdd);
    setIsAddingToCart(false);

    if (success) {
      router.push('/cart');
    } else {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Bespoke Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white px-4 py-2 rounded-full">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="font-medium text-sm">BESPOKE TAILORED</span>
        </div>
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-lg text-[#56193F] font-medium mb-3">Custom Tailored Edition</p>
        
        {/* Star Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">5.0 (Premium Bespoke)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-3xl font-bold text-gray-900">${(product.price * 1.5).toFixed(2)}</p>
          <span className="text-lg text-gray-500 line-through">${product.price}</span>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">+50% Bespoke Premium</span>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="bg-[#56193F]/5 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Bespoke Description</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          <p className="text-sm text-[#56193F] mt-2 font-medium">
            ✨ This piece will be custom-tailored to your exact measurements for the perfect fit.
          </p>
        </div>
      )}

      {/* Color Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-900">Color:</span>
          <span className="text-sm text-gray-600">{selectedColor}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => {
            // Map color names to actual colors for display
            const colorMap = {
              'Black': '#000000',
              'White': '#FFFFFF',
              'Red': '#EF4444',
              'Blue': '#3B82F6',
              'Green': '#10B981',
              'Yellow': '#F59E0B',
              'Purple': '#8B5CF6',
              'Pink': '#EC4899',
              'Gray': '#6B7280',
              'Brown': '#92400E',
              'Orange': '#F97316',
              'Navy': '#1E3A8A',
              'Beige': '#D2B48C',
              'Multi-color': '#8B5CF6',
              'Gold': '#FFD700',
              'Silver': '#C0C0C0',
              'Bronze': '#CD7F32',
              'Rose Gold': '#E8B4A0',
              'Khaki': '#F0E68C',
              'Dark Brown': '#654321',
              'Tan': '#D2B48C',
              'Coral': '#F08080',
              'Magenta': '#FF00FF',
              'Cyan': '#00FFFF',
              'Lavender': '#E6E6FA',
              'Salmon': '#FA8072',
              'Periwinkle': '#C9C9FF',
              'Azure': '#F0FFFF',
            };
            
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-[#56193f] ring-2 ring-[#56193f] ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: colorMap[color] || '#8B5CF6' }}
                title={color}
              />
            );
          })}
        </div>
      </div>

      {/* Custom Measurements Section */}
      <div className="bg-gradient-to-r from-[#56193F]/10 to-[#8B5CF6]/10 p-6 rounded-lg border border-[#56193F]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Custom Measurements Required</h3>
            <p className="text-sm text-gray-600">Provide your measurements for the perfect bespoke fit</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowMeasurementModal(true)}
            className={`flex-1 py-3 px-6 text-sm font-medium border rounded-lg transition-colors ${
              customMeasurements
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-[#56193f] bg-[#56193f] text-white hover:bg-[#56193f]/90'
            }`}
          >
            {customMeasurements ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Measurements Provided
              </div>
            ) : (
              'Provide Custom Measurements'
            )}
          </button>
          {customMeasurements && (
            <button
              onClick={() => setShowMeasurementModal(true)}
              className="py-3 px-4 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        {customMeasurements && (
          <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded">
            ✓ Custom measurements saved for {customMeasurements.productName}
          </div>
        )}
      </div>

      {/* Size Chart Link */}
      <div className="flex items-center justify-between mb-3">
        {onShowSizeGuide && (
          <button
            onClick={onShowSizeGuide}
            className="text-sm text-[#56193f] hover:text-[#56193f]/80 underline"
          >
            View Size Chart (Reference Only)
          </button>
        )}
      </div>

      {/* Quantity and Actions */}
      <div className="flex items-center justify-between gap-6">
        {/* Quantity Selection */}
        <div>
          <span className="text-sm font-medium text-gray-900 mb-3 block">Quantity:</span>
          <div className="flex items-center space-x-1 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
            >
              -
            </button>
            <span className="text-sm rounded w-8 h-8 border border-gray-300 font-medium flex items-center justify-center text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-1 items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !customMeasurements || product.quantity === 0}
            className="flex-1 bg-gradient-to-r from-[#56193f] to-[#8B5CF6] w-full max-w-[180px] text-white py-3 px-6 rounded-lg font-medium hover:from-[#56193f]/90 hover:to-[#8B5CF6]/90 focus:outline-none focus:ring-2 focus:ring-[#56193f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {product.quantity === 0 ? 'Out of Stock' : 
             isAddingToCart ? 'Adding to Cart...' : 'Add Bespoke Item'}
          </button>
          
          <button
            className="flex-1 w-full max-w-[148px] bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
          >
            Order Now
          </button>
          
          <button
            className="p-3 border border-gray-300 rounded-full hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            title="Add to Favorites"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bespoke Guarantee */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Perfect Fit Guarantee</h4>
            <p className="text-xs text-gray-600 mt-1">
              We guarantee a perfect fit or we'll remake your garment at no extra cost. 
              Delivery in 2-3 weeks with premium packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Measurement Modal */}
      <CustomMeasurementModal
        isOpen={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        productName={product.name}
        onSaveMeasurements={handleSaveMeasurements}
      />
    </div>
  );
}
