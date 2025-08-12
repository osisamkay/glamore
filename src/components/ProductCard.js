"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Safeguard against missing product or price
  if (!product || typeof product.price !== 'number' || !product.id || !product.image) {
    // Returning null will prevent rendering of this card if data is incomplete
    return null; 
  }

  const { id, name, price, image } = product;

  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="bg-gray-50 p-4 rounded-xl transition-shadow duration-300 group-hover:shadow-md">
        <div className="aspect-[3/4] w-full relative overflow-hidden rounded-lg mb-3">
          <Image 
            src={image} 
            alt={name || 'Product Image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="text-left">
          <h3 className="text-sm text-gray-700 mb-1 truncate">{name || 'Unnamed Product'}</h3>
          <p className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
