"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  const { id, name, image, url } = category;

  return (
    <Link href={url} className="block group">
      <h3 className="text-base font-medium mb-4">{name}</h3>
      <div className="aspect-[3/4] w-full max-w-[400px] mx-auto h-[328px] relative overflow-hidden rounded-2xl">
        <Image 
          src={image} 
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </Link>
  );
}
