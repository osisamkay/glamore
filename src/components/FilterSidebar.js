"use client";

import { useState, useEffect } from 'react';

const ActiveFilterTag = ({ label, onRemove }) => (
  <div className="flex items-center bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
    <span>{label}</span>
    <button onClick={onRemove} className="ml-2 text-gray-500 hover:text-gray-800">
      &times;
    </button>
  </div>
);

export default function FilterSidebar({ onFilterChange, availableFilters }) {
  const [filters, setFilters] = useState({
    labels: [],
    colors: [],
    sizes: [],
    price: { min: availableFilters.minPrice, max: availableFilters.maxPrice },
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value, 10);
    setFilters(prev => ({ ...prev, price: { ...prev.price, max: newMax } }));
  };
  
  const getActiveFilters = () => {
    return [
        ...filters.labels,
        ...filters.colors,
        ...filters.sizes,
    ];
  };

  const removeFilter = (type, value) => {
    setFilters(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item !== value),
    }));
  };

  return (
    <div className="w-full lg:w-1/4 lg:pr-10">
      <h2 className="text-xl font-light mb-4">Filter</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.labels.map(filter => (
          <ActiveFilterTag key={`label-${filter}`} label={filter} onRemove={() => removeFilter('labels', filter)} />
        ))}
        {filters.colors.map(filter => (
          <ActiveFilterTag key={`color-${filter}`} label={filter} onRemove={() => removeFilter('colors', filter)} />
        ))}
        {filters.sizes.map(filter => (
          <ActiveFilterTag key={`size-${filter}`} label={filter} onRemove={() => removeFilter('sizes', filter)} />
        ))}
      </div>

      <div className="space-y-6">
        {/* Labels Filter */}
        <div>
          <h3 className="font-medium mb-3">Label</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {availableFilters.labels.map(label => (
              <label key={label} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded text-[#56193f] focus:ring-[#56193f] border-gray-300"
                  checked={filters.labels.includes(label)}
                  onChange={() => handleCheckboxChange('labels', label)}
                /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Price Range</h3>
            <span className="text-sm text-gray-600">${filters.price.min} - ${filters.price.max}</span>
          </div>
          <input 
            type="range" 
            min={availableFilters.minPrice}
            max={availableFilters.maxPrice}
            value={filters.price.max}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="font-medium mb-3">Color</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {availableFilters.colors.map(color => (
              <label key={color} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded text-[#56193f] focus:ring-[#56193f] border-gray-300"
                  checked={filters.colors.includes(color)}
                  onChange={() => handleCheckboxChange('colors', color)}
                /> {color}
              </label>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="font-medium mb-3">Size</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {availableFilters.sizes.map(size => (
              <label key={size} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded text-[#56193f] focus:ring-[#56193f] border-gray-300"
                  checked={filters.sizes.includes(size)}
                  onChange={() => handleCheckboxChange('sizes', size)}
                /> {size}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
