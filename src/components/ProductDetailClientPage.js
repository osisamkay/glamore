"use client";

import { useState } from 'react';
import Image from 'next/image';

// Placeholder components that we will create next
import ProductInfo from './ProductInfo';
import ReviewSection from './ReviewSection';

export default function ProductDetailClientPage({ product }) {
  if (!product) return null;

  return (
    <div>
      <div className="flex flex-col mt-43 lg:flex-row gap-12">
        {/* Product Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-center object-cover"
            />
          </div>
          {/* Thumbnail images could go here */}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection product={product} />
    </div>
  );
}

