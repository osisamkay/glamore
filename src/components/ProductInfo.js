"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductInfo({ product, onShowSizeGuide }) {

  // Handle colors and sizes that may be arrays or comma-separated strings
  const availableColors = Array.isArray(product.colors) 
    ? product.colors 
    : (product.colors ? product.colors.split(',') : [product.color || 'Black']);
  const availableSizes = Array.isArray(product.sizes)
    ? product.sizes
    : (product.sizes ? product.sizes.split(',') : (Array.isArray(product.size) ? product.size : []));
  
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
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
      size: selectedSize,
      quantity: quantity,
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
      {/* Product Title */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
        
        {/* Star Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">4 (67 Reviews)</span>
        </div>
        
        {/* Price */}
        <p className="text-2xl font-bold text-gray-900">${product.price}</p>
      </div>

      {/* Product Description */}
      {product.description && (
        <div>
          <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
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
              'Multi-color': '#8B5CF6'
            };
            
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
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

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">Size: {selectedSize}</span>
            {onShowSizeGuide && (
              <button
                onClick={onShowSizeGuide}
                className="text-sm text-[#56193f] hover:text-[#56193f]/80 underline"
              >
                View Size Chart
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-4 text-sm font-medium border rounded ${
                  selectedSize === size
                    ? 'border-[#56193f] bg-[#56193f] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <span className="text-sm font-medium text-gray-900 mb-3 block">Quantity:</span>
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
          >
            -
          </button>
          <span className="text-sm font-medium text-gray-900 w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedSize || product.quantity === 0}
          className="flex-1 bg-[#56193f] text-white py-3 px-6 rounded font-medium hover:bg-[#56193f]/90 focus:outline-none focus:ring-2 focus:ring-[#56193f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.quantity === 0 ? 'Out of Stock' : 
           isAddingToCart ? 'Adding to Cart...' : 'Add To Cart'}
        </button>
        
        <button
          className="flex-1 bg-gray-900 text-white py-3 px-6 rounded font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Buy Now
        </button>
        
        <button
          className="p-3 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          title="Add to Favorites"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
        <ul className="text-gray-600 space-y-1">
          <li><strong>Category:</strong> {product.category}</li>
          <li><strong>Available Colors:</strong> {availableColors.join(', ')}</li>
          <li><strong>Available Sizes:</strong> {availableSizes.join(', ')}</li>
          <li><strong>Selected:</strong> {selectedColor || "Purple"} • {selectedSize}</li>
          <li><strong>Stock Status:</strong> {product.quantity} items remaining</li>
        </ul>
      </div>
    </div>
  );
}