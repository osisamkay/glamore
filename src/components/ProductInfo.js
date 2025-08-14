"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Parse sizes from comma-separated string if needed
  const availableSizes = Array.isArray(product.size) 
    ? product.size 
    : (product.sizes ? product.sizes.split(',') : []);

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
        <p className="text-2xl font-medium text-gray-900 mt-2">${product.price}</p>
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">{selectedColor}</span>
          </div>
          <span className="text-gray-700">{selectedColor}</span>
        </div>
      </div>

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-4 gap-2">
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
        disabled={isAddingToCart || !selectedSize}
        className="w-full bg-[#56193f] text-white py-3 px-6 rounded-md font-medium hover:bg-[#56193f]/90 focus:outline-none focus:ring-2 focus:ring-[#56193f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
      </button>

      {/* Product Details */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
        <ul className="text-gray-600 space-y-1">
          <li>Category: {product.category}</li>
          <li>Available Sizes: {availableSizes.join(', ')}</li>
          <li>Color: {selectedColor}</li>
        </ul>
      </div>
    </div>
  );
}