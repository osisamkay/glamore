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
      ...product,
      color: selectedColor,
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
      {/* Product Title and Price */}
      <div>
        <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-medium text-gray-900">${product.price}</p>
          <p className="text-sm text-gray-600">
            {product.quantity > 10 ? (
              <span className="text-green-600">✓ In Stock ({product.quantity} left)</span>
            ) : product.quantity > 0 ? (
              <span className="text-orange-600">⚠ Low Stock ({product.quantity} left)</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </p>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 text-sm font-medium border rounded-md ${
                selectedColor === color
                  ? 'border-[#56193f] bg-[#56193f] text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Size</h3>
            {onShowSizeGuide && (
              <button
                onClick={onShowSizeGuide}
                className="text-sm text-[#56193f] hover:text-[#56193f]/80 underline"
              >
                View Size Chart
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 text-sm font-medium border rounded-md ${
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
        <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
          >
            -
          </button>
          <span className="text-lg font-medium text-gray-900 w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || !selectedSize || product.quantity === 0}
        className="w-full bg-[#56193f] text-white py-3 px-6 rounded-md font-medium hover:bg-[#56193f]/90 focus:outline-none focus:ring-2 focus:ring-[#56193f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.quantity === 0 ? 'Out of Stock' : 
         isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
      </button>

      {/* Product Details */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
        <ul className="text-gray-600 space-y-1">
          <li><strong>Category:</strong> {product.category}</li>
          <li><strong>Available Colors:</strong> {availableColors.join(', ')}</li>
          <li><strong>Available Sizes:</strong> {availableSizes.join(', ')}</li>
          <li><strong>Selected:</strong> {selectedColor} • {selectedSize}</li>
          <li><strong>Stock Status:</strong> {product.quantity} items remaining</li>
        </ul>
      </div>
    </div>
  );
}