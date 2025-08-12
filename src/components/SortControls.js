"use client";

import { useState } from 'react';

const SortIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

export default function SortControls({ onSortChange, onSearchChange, resultCount, categoryName }) {
  const [activeSort, setActiveSort] = useState('new');

  const sortOptions = {
    'new': 'New',
    'price-asc': 'Price ascending',
    'price-desc': 'Price descending',
    'rating': 'Rating',
  };

  const handleSortClick = (optionKey) => {
    setActiveSort(optionKey);
    onSortChange(optionKey);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light capitalize">{categoryName}</h1>
        <p className="text-gray-500">{resultCount} results</p>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-auto">
          <input 
            type="search" 
            placeholder="Search in this category..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
          <button className="p-2 rounded-md hover:bg-gray-100">
              <SortIcon />
          </button>
          {Object.entries(sortOptions).map(([key, value]) => (
            <button 
              key={key}
              onClick={() => handleSortClick(key)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${ 
                activeSort === key 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
