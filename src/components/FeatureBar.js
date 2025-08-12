import React from 'react';

const FeatureIcon = ({ d }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.05-2.05A1 1 0 016.7 14H13z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-3.95a1 1 0 00-.7.3L12 10" /></svg>,
    text: 'Delivery Across Canada',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" /></svg>,
    text: 'Quality Satisfaction Guarantee',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 21a9 9 0 010-18v18z" /><path d="M9 9a3 3 0 013-3m-3 3a3 3 0 003 3m-3-3h.01M15 9a3 3 0 013-3m-3 3a3 3 0 003 3m-3-3h.01" /></svg>,
    text: 'Exceptional Customer Support',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    text: 'Secure Payments',
  },
];

export default function FeatureBar() {
  return (
    <div className="bg-white text-black py-8 border-b border-gray-200">
      <div className="container max-w-[1324px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 text-center text-xs font-medium uppercase tracking-wider">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center justify-start gap-3">
              {feature.icon}
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
