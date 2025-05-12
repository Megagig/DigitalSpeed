'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from 'react-icons/fa';

// Sample product data (in a real app, this would come from your database)
const allProducts = [
  {
    id: 1,
    name: 'Premium WordPress Theme',
    slug: 'premium-wordpress-theme',
    description:
      'A responsive and customizable WordPress theme for businesses and portfolios.',
    price: 59.99,
    salePrice: 49.99,
    images: ['/images/placeholders/product-1.jpg'],
    category: 'Themes',
    rating: 4.5,
    reviews: 28,
    featured: true,
  },
  {
    id: 2,
    name: 'React Component Library',
    slug: 'react-component-library',
    description:
      'A collection of reusable React components to speed up your development process.',
    price: 39.99,
    salePrice: null,
    images: ['/images/placeholders/product-2.jpg'],
    category: 'Components',
    rating: 5,
    reviews: 42,
    featured: true,
  },
  {
    id: 3,
    name: 'E-commerce Starter Kit',
    slug: 'ecommerce-starter-kit',
    description:
      'Everything you need to start your online store with Next.js and Stripe integration.',
    price: 79.99,
    salePrice: 69.99,
    images: ['/images/placeholders/product-3.jpg'],
    category: 'Templates',
    rating: 4.8,
    reviews: 35,
    featured: true,
  },
  {
    id: 4,
    name: 'Admin Dashboard Template',
    slug: 'admin-dashboard-template',
    description:
      'A modern admin dashboard template with dark mode support and responsive design.',
    price: 49.99,
    salePrice: null,
    images: ['/images/placeholders/product-4.jpg'],
    category: 'Templates',
    rating: 4.2,
    reviews: 19,
    featured: false,
  },
  {
    id: 5,
    name: 'UI Icon Pack',
    slug: 'ui-icon-pack',
    description:
      'A comprehensive pack of 500+ SVG icons for your web and mobile applications.',
    price: 24.99,
    salePrice: 19.99,
    images: ['/images/placeholders/product-5.jpg'],
    category: 'Graphics',
    rating: 4.7,
    reviews: 53,
    featured: false,
  },
  {
    id: 6,
    name: 'Landing Page Template',
    slug: 'landing-page-template',
    description:
      'A high-converting landing page template for SaaS and digital products.',
    price: 29.99,
    salePrice: null,
    images: ['/images/placeholders/product-6.jpg'],
    category: 'Templates',
    rating: 4.4,
    reviews: 31,
    featured: false,
  },
  {
    id: 7,
    name: 'JavaScript Animations Library',
    slug: 'javascript-animations-library',
    description:
      'A lightweight library for creating smooth and interactive animations on your website.',
    price: 34.99,
    salePrice: 29.99,
    images: ['/images/placeholders/product-7.jpg'],
    category: 'Components',
    rating: 4.6,
    reviews: 24,
    featured: false,
  },
  {
    id: 8,
    name: 'Portfolio Website Template',
    slug: 'portfolio-website-template',
    description:
      'A clean and modern portfolio template for designers and developers.',
    price: 44.99,
    salePrice: null,
    images: ['/images/placeholders/product-8.jpg'],
    category: 'Templates',
    rating: 4.3,
    reviews: 17,
    featured: false,
  },
];

// Get all unique categories
const allCategories = [
  'All',
  ...new Set(allProducts.map((product) => product.category)),
];

// Rating component
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const ShopPage = () => {
  const [products, setProducts] = useState(allProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort products
  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.category === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'featured':
        filtered = [...filtered].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
        break;
      case 'price-low':
        filtered = [...filtered].sort(
          (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case 'price-high':
        filtered = [...filtered].sort(
          (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setProducts(filtered);
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shop
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Browse my collection of premium digital products, templates, and
            resources.
          </p>
        </div>

        {/* Search, Filter, and Sort */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {allCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      activeCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link href={`/shop/${product.slug}`} key={product.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-64 w-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.salePrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <RatingStars rating={product.rating} />
                        <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {product.salePrice ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 dark:text-gray-400 line-through text-sm mr-2">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              ${product.salePrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors">
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
