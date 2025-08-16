"use client";

import { useState } from 'react';
import Image from 'next/image';

// Components
import BespokeProductInfo from './BespokeProductInfo';
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

export default function BespokeProductDetailClientPage({ product }) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  return (
    <div className="max-w-7xl mt-43 mx-auto">
      {/* Bespoke Hero Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white px-6 py-3 rounded-full mb-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="font-semibold text-lg">BESPOKE TAILORED COLLECTION</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Made for You</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the luxury of perfectly fitted garments crafted to your exact measurements. 
          Each piece is individually tailored by our master craftsmen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="w-full relative">
          <div className="w-full h-full max-h-[480px] overflow-hidden rounded-lg border-2 border-[#56193F]/20">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          {/* Bespoke overlay on image */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white px-4 py-2 rounded-full text-sm font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              BESPOKE
            </div>
          </div>
          
          {/* Bespoke Features */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-[#56193F]/20">
              <h4 className="font-semibold text-gray-900 mb-2">Bespoke Features</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#56193F] rounded-full"></div>
                  Custom Measurements
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#56193F] rounded-full"></div>
                  Premium Materials
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#56193F] rounded-full"></div>
                  Hand-Crafted
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#56193F] rounded-full"></div>
                  Perfect Fit Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full">
          <BespokeProductInfo 
            product={product} 
            onShowSizeGuide={() => setShowSizeGuide(true)}
          />
        </div>
      </div>

      {/* Bespoke Process Section */}
      <div className="mb-16 bg-gradient-to-r from-gray-50 to-[#56193F]/5 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Our Bespoke Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#56193F] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Measurements</h4>
            <p className="text-sm text-gray-600">Provide detailed body measurements for perfect fit</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#56193F] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Crafting</h4>
            <p className="text-sm text-gray-600">Master tailors create your garment by hand</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#56193F] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quality Check</h4>
            <p className="text-sm text-gray-600">Rigorous quality control ensures perfection</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#56193F] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
            <p className="text-sm text-gray-600">Your custom piece delivered in 2-3 weeks</p>
          </div>
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
