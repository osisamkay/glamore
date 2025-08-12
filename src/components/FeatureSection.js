"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function FeatureSection() {
  return (
    <div className="relative w-full bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Image */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/feature-image-1.jpg"
                alt="Feature garment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          
          {/* Middle column - Text overlay */}
          <div className="md:col-span-1 flex items-center justify-center relative">
            <div className="bg-black/80 text-white p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-semibold mb-3">Perfect Fit Garments,<br />To Your Specifications</h2>
              <p className="text-sm mb-4">Handcrafted with premium fabrics and attention to detail</p>
              <Link href="/custom" className="inline-block bg-white text-black px-4 py-2 text-sm uppercase hover:bg-gray-200 transition-colors">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Right column - Image grid */}
          <div className="md:col-span-1 grid grid-cols-2 gap-3">
            <div className="relative aspect-square w-full">
              <Image
                src="/feature-image-2.jpg"
                alt="Feature garment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
            <div className="relative aspect-square w-full">
              <Image
                src="/feature-image-3.jpg"
                alt="Feature garment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
            <div className="col-span-2">
              <div className="relative aspect-[2/1] w-full">
                <Image
                  src="/feature-image-4.jpg"
                  alt="Feature garment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
