"use client";

import Image from "next/image";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import PerfectFitSection from '../components/PerfectFitSection';
import { collections, featuredProducts, perfectFitImages, shopByCategories } from "../data/products";
import { useState } from 'react';

export default function Home() {
  const [activeCollection, setActiveCollection] = useState('women');

  return (
    <Layout>
      {/* Hero Banner */}
      <Hero />

      {/* Unified Shopping Section */}
      <section className="py-16">
        <div className="container max-w-[1324px] mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light">Shop By Category</h2>
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

          {/* Category Cards */}
          <div className="grid grid-cols-3 gap-8">
            {collections[activeCollection].map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* Latest Arrivals */}
          <div className="mt-16">
            <h2 className="text-2xl font-light mb-8 text-center">Latest Arrivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts[activeCollection].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perfect Fit Garments Section */}
      <PerfectFitSection images={perfectFitImages[activeCollection]} />

    </Layout>
  );
}
