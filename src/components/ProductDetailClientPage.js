"use client";

import { useState } from 'react';
import Image from 'next/image';

// Components
import ProductInfo from './ProductInfo';
import ReviewSection from './ReviewSection';

// Size Guide Modal Component
const SizeGuideModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const sizeCharts = {
    men: {
      title: "Size Guide For Men",
      headers: ["Size", "UK", "US", "EU", "Chest", "Waist", "Hip", "Length"],
      rows: [
        ["S", "36", "36-37", "46", "36", "28", "36", "27"],
        ["M", "38", "38-39", "50", "38", "30", "38", "28"],
        ["L", "40", "40", "52", "40", "32", "40", "29"],
        ["XL", "42", "42-44", "56", "42", "34", "42", "30"],
        ["XXL", "44", "46", "60", "44", "36", "44", "31"],
        ["3XL", "46", "48", "64", "46", "38", "46", "32"]
      ]
    },
    women: {
      title: "Size Guide For Women",
      headers: ["Size", "UK", "US", "EU", "Bust", "Waist", "Hip", "Length"],
      rows: [
        ["XS", "6", "2", "34", "32", "24", "34", "26"],
        ["S", "8", "4", "36", "34", "26", "36", "27"],
        ["M", "10", "6", "38", "36", "28", "38", "28"],
        ["L", "12", "8", "40", "38", "30", "40", "29"],
        ["XL", "14", "10", "42", "40", "32", "42", "30"],
        ["XXL", "16", "12", "44", "42", "34", "44", "31"]
      ]
    },
    kids: {
      title: "Size Guide For Kids",
      headers: ["Size", "Age", "Height", "Chest", "Waist", "Hip"],
      rows: [
        ["XS", "2-3", "92-98", "52", "50", "54"],
        ["S", "4-5", "104-110", "56", "52", "58"],
        ["M", "6-7", "116-122", "60", "54", "62"],
        ["L", "8-9", "128-134", "64", "56", "66"],
        ["XL", "10-11", "140-146", "68", "58", "70"]
      ]
    }
  };

  const chart = sizeCharts[category] || sizeCharts.men;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{chart.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {chart.headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailClientPage({ product }) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  return (
    <div className="max-w-7xl mt-43 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="w-full">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-center object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full">
          <ProductInfo 
            product={product} 
            onShowSizeGuide={() => setShowSizeGuide(true)}
          />
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection product={product} />

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </div>
  );
}

