"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import SortControls from './SortControls';

export default function CategoryClientPage({ initialProducts, category }) {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    labels: [],
    colors: [],
    sizes: [],
    price: null,
  });
  const [sortOption, setSortOption] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let tempProducts = [...initialProducts];

    // Filter by search query
    if (searchQuery) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by labels (tags)
    if (filters.labels.length > 0) {
      tempProducts = tempProducts.filter(p =>
        filters.labels.every(label => p.tags.includes(label))
      );
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      tempProducts = tempProducts.filter(p =>
        filters.colors.includes(p.color)
      );
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
      tempProducts = tempProducts.filter(p =>
        p.size.some(s => filters.sizes.includes(s))
      );
    }
    
    // Filter by price
    if (filters.price) {
        tempProducts = tempProducts.filter(p => p.price >= filters.price.min && p.price <= filters.price.max);
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - b.price);
        break;
      case 'rating':
        tempProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'new':
      default:
        tempProducts.sort((a, b) => b.id - a.id);
        break;
    }

    setProducts(tempProducts);
  }, [filters, sortOption, searchQuery, initialProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
  };
  
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const availableFilters = {
    colors: [...new Set(initialProducts.flatMap(p => p.color))],
    sizes: [...new Set(initialProducts.flatMap(p => p.size))],
    labels: [...new Set(initialProducts.flatMap(p => p.tags))],
    minPrice: Math.min(...initialProducts.map(p => p.price)),
    maxPrice: Math.max(...initialProducts.map(p => p.price)),
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <FilterSidebar 
        onFilterChange={handleFilterChange}
        availableFilters={availableFilters}
      />
      <div className="w-full">
        <SortControls 
          onSortChange={handleSortChange} 
          onSearchChange={handleSearchChange}
          resultCount={products.length}
          categoryName={category}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">No products found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

