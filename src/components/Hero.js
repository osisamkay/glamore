"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = ['/hero1.png', '/hero2.png', '/hero3.png'];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // Change image every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative w-full max-w-[1324px] mx-auto h-[850px] mt-43 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 h-full">
        <div className="col-span-4 relative">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Hero Banner"
              fill
              className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              priority={index === 0} // Prioritize loading the first image
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-5xl font-bold italic tracking-wide leading-tight">
                ELEGANT LOOK<br />OF CLOTHES<br />THAT SHINE
              </h1>
              <div className="w-16 h-1 bg-white mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
