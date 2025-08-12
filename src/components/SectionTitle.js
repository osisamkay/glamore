"use client";

export default function SectionTitle({ title }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-xl uppercase font-medium tracking-wider">{title}</h2>
      <div className="w-12 h-0.5 bg-gray-400 mx-auto mt-2"></div>
    </div>
  );
}
