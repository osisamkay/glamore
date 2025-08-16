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

export default function BespokePage() {
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
      {/* Bespoke Hero Section */}
      <section className="relative bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white py-20">
        <div className="container max-w-[1324px] mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="font-semibold text-lg">BESPOKE COLLECTION</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Tailored to Perfection</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Experience the luxury of custom-made garments crafted exclusively for you. 
            Each piece is individually tailored to your exact measurements by our master craftsmen.
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">2-3</div>
              <div className="text-sm text-white/80">Weeks Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-white/80">Perfect Fit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-white/80">Customization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Shopping Section */}
      <section className="py-16">
        <div className="container max-w-[1324px] mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light">Bespoke Collections</h2>
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
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white px-3 py-1 rounded-full text-xs font-medium">
                  BESPOKE
                </div>
              </div>
            ))}
          </div>

          {/* Latest Bespoke Arrivals */}
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
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      BESPOKE
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bespoke Process Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-[#56193F]/5">
        <div className="container max-w-[1324px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Bespoke Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Measurements</h3>
              <p className="text-gray-600">Provide detailed body measurements through our precision measurement system for the perfect fit</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Crafting</h3>
              <p className="text-gray-600">Our master tailors handcraft your garment using premium materials and traditional techniques</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Check</h3>
              <p className="text-gray-600">Rigorous quality control ensures every stitch meets our exacting standards of perfection</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#56193F] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery</h3>
              <p className="text-gray-600">Your custom masterpiece is delivered in premium packaging within 2-3 weeks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect Fit Garments Section */}
      <PerfectFitSection images={perfectFitImages[activeCollection]} />

    </Layout>
  );
}
