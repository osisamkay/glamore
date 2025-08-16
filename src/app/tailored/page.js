"use client";

import Image from "next/image";
import Layout from "../../components/Layout";
import Hero from "../../components/Hero";
import SectionTitle from "../../components/SectionTitle";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import PerfectFitSection from '../../components/PerfectFitSection';
import { collections, perfectFitImages, shopByCategories } from "../../data/products";
import { useState, useEffect } from 'react';

export default function TailoredPage() {
  const [activeCollection, setActiveCollection] = useState('women');
  const [latestProducts, setLatestProducts] = useState({
    women: [],
    men: [],
    kids: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch latest arrivals from API
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products for each category (8 products each)
        const [womenRes, menRes, kidsRes] = await Promise.all([
          fetch('/api/products?category=women&limit=8'),
          fetch('/api/products?category=men&limit=8'),
          fetch('/api/products?category=kids&limit=8')
        ]);

        const [womenData, menData, kidsData] = await Promise.all([
          womenRes.json(),
          menRes.json(),
          kidsRes.json()
        ]);

        setLatestProducts({
          women: womenData.products || [],
          men: menData.products || [],
          kids: kidsData.products || []
        });
      } catch (error) {
        console.error('Error fetching latest products:', error);
        // Set empty arrays as fallback
        setLatestProducts({
          women: [],
          men: [],
          kids: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <Hero />

      {/* Unified Shopping Section */}
      <section className="py-16">
        <div className="container max-w-[1324px] mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light">Shop By Category - Bespoke Tailored</h2>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveCollection('women')}
                className={`text-sm font-medium uppercase tracking-wider ${activeCollection === 'women' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                Women
              </button>
              <button 
                onClick={() => setActiveCollection('men')}
                className={`text-sm font-medium uppercase tracking-wider ${activeCollection === 'men' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                Men
              </button>
              <button 
                onClick={() => setActiveCollection('kids')}
                className={`text-sm font-medium uppercase tracking-wider ${activeCollection === 'kids' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                Kids
              </button>
            </div>
          </div>

          {/* Category Cards with Bespoke Tag */}
          <div className="grid grid-cols-3 gap-8">
            {collections[activeCollection].map((category) => (
              <div key={category.id} className="relative">
                <CategoryCard category={category} bespoke={true} />
                <div className="absolute top-4 left-4 bg-[#56193F] text-white px-3 py-1 rounded-full text-xs font-medium">
                  BESPOKE
                </div>
              </div>
            ))}
          </div>

          {/* Latest Arrivals with Bespoke Tag */}
          <div className="mt-16">
            <h2 className="text-2xl font-light mb-8 text-center">Latest Bespoke Arrivals</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {latestProducts[activeCollection].map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} bespoke={true} />
                    <div className="absolute top-2 left-2 bg-[#56193F] text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      BESPOKE
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Perfect Fit Garments Section */}
      <PerfectFitSection images={perfectFitImages[activeCollection]} />

    </Layout>
  );
}
