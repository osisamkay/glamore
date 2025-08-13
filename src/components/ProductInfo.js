"use client";

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import SizeChartModal from './SizeChartModal';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [selectedSize, setSelectedSize] = useState(product.size[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setSizeChartOpen] = useState(false);

  // Static color options for the UI, as the data model has one color per product
  const availableColors = {
    'Beige': 'bg-stone-200',
    'Black': 'bg-black',
    'Blue': 'bg-blue-600',
    'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400',
  };

  return (
    <>
      <div className="font-sans">
        <p className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</p>
        <h1 className="text-4xl font-normal text-gray-800 mt-2">{product.name}</h1>

        {/* Reviews */}
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    (product.rating || 4) > rating ? 'text-yellow-400' : 'text-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-600">
              4 ({product.reviewCount || 67} Reviews)
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-5">
          <p className="text-4xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>

        {/* Description */}
        <div className="mt-6">
          <div className="text-sm text-gray-600 leading-relaxed">
              <p>Duis pharetra molestie orci id porta. Morbi sit amet pharetra nisl. Nullam hendrerit ornare quam vel lobortis. Cras pretium in ex.</p>
          </div>
        </div>

        {/* Colors */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-800">Colour: <span className='font-normal text-gray-600'>{selectedColor}</span></h3>
          <div className="flex items-center space-x-2 mt-3">
            {Object.entries(availableColors).map(([name, className]) => (
               <button 
                  key={name}
                  onClick={() => setSelectedColor(name)} 
                  className={`w-7 h-7 rounded-full ${className} border-2 ${selectedColor === name ? 'border-purple-600 ring-1 ring-purple-600 ring-offset-1' : 'border-gray-300'}`}>
                  <span className="sr-only">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">Size: <span className='font-normal text-gray-600'>{selectedSize}</span></h3>
            <button onClick={() => setSizeChartOpen(true)} className="text-sm font-medium text-gray-600 underline hover:text-purple-700">
              View Size Chart
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 mt-3">
            {product.size.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 border rounded-md text-xs font-medium transition-colors duration-200 ${selectedSize === size ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="mt-8 flex items-center gap-x-4">
          <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className='px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-md'>-</button>
              <span className='px-5 py-3 text-sm font-medium'>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className='px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-md'>+</button>
          </div>
          <button className="flex-1 bg-purple-800 text-white font-semibold py-3 rounded-md hover:bg-purple-900 transition-colors">Add To Cart</button>
          <button className="flex-1 bg-purple-700 text-white font-semibold py-3 rounded-md hover:bg-purple-800 transition-colors">Buy Now</button>
          <button className='p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors'>
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setSizeChartOpen(false)} />
    </>
  );
}
