"use client";

import Image from "next/image";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Newsletter from "../components/Newsletter";
import PerfectFitSection from '../components/PerfectFitSection';
import { collections, featuredProducts, shopByCategories } from "../data/products";
import { useState } from 'react';

export default function Home() {
  const [activeCollection, setActiveCollection] = useState('women');

  return (
    <Layout>
      {/* Hero Banner */}
      <Hero />

      {/* Shop by Category Section */}
      <section className="py-16">
        <div className="container max-w-[1324px] mx-auto px-4">
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
          <div className="grid grid-cols-3 gap-8">
            {collections[activeCollection].map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

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

      {/* Feature Section */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 text-white p-6 rounded-none">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <h2 className="text-xl font-medium mb-2">Perfect Fit Garments,<br />To Your Specifications</h2>
                <p className="text-sm mb-4">Custom tailored pieces designed to fit your unique style</p>
                <button className="bg-white text-black px-4 py-1 text-sm hover:bg-gray-200 transition-colors uppercase">Shop Now</button>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <div className="relative h-32">
                  <Image src="/Men's GGF Photos/Vibe Agbada.jpg" alt="Custom Fit" fill className="object-cover" />
                </div>
                <div className="relative h-32">
                  <Image src="/Women's GGF Photos/Victoria Island Blazer.jpg" alt="Custom Fit" fill className="object-cover" />
                </div>
                <div className="relative h-32">
                  <Image src="/Women's GGF Photos/Ankara Dress.jpg" alt="Custom Fit" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Icons */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">Shop By Category</h2>
            <a href="/categories" className="text-xs text-gray-500 hover:underline">View All</a>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {shopByCategories.slice(0, 4).map((category) => (
              <a href={category.url} key={category.id} className="group">
                <div className="aspect-square relative rounded-full overflow-hidden border border-gray-200 mb-2">
                  <div className="flex items-center justify-center h-full bg-white">
                    <span className="text-xl font-medium">{category.id}</span>
                  </div>
                </div>
                <h3 className="text-xs font-medium">{category.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect Fit Garments Section */}
      <PerfectFitSection />

      {/* Newsletter Section */}
      <Newsletter />
    </Layout>
  );
}
