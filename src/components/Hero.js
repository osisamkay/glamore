"use client";

import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative w-full max-w-[1324px] mx-auto h-[850px] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 h-full">
        <div className="col-span-4 relative">
          <Image
            src="/Homepage Womens- 3.jpg"
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
          />
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
