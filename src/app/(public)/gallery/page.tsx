'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Sample gallery data (in a real app, this would come from your database)
const allImages = [
  {
    id: 1,
    title: 'Modern Website Design',
    description: 'A clean and modern website design for a tech startup.',
    imageUrl: '/images/placeholders/gallery-1.jpg',
    category: 'Web Design',
  },
  {
    id: 2,
    title: 'Mobile App Interface',
    description:
      'User interface design for a fitness tracking mobile application.',
    imageUrl: '/images/placeholders/gallery-2.jpg',
    category: 'UI/UX',
  },
  {
    id: 3,
    title: 'E-commerce Product Page',
    description: 'Product page design for an online fashion store.',
    imageUrl: '/images/placeholders/gallery-3.jpg',
    category: 'Web Design',
  },
  {
    id: 4,
    title: 'Dashboard UI',
    description: 'Admin dashboard interface for a SaaS platform.',
    imageUrl: '/images/placeholders/gallery-4.jpg',
    category: 'UI/UX',
  },
  {
    id: 5,
    title: 'Landing Page',
    description: 'Conversion-focused landing page for a digital product.',
    imageUrl: '/images/placeholders/gallery-5.jpg',
    category: 'Web Design',
  },
  {
    id: 6,
    title: 'Mobile App Onboarding',
    description: 'Onboarding screens for a travel booking application.',
    imageUrl: '/images/placeholders/gallery-6.jpg',
    category: 'UI/UX',
  },
  {
    id: 7,
    title: 'Blog Layout',
    description: 'Clean and readable blog layout design.',
    imageUrl: '/images/placeholders/gallery-7.jpg',
    category: 'Web Design',
  },
  {
    id: 8,
    title: 'Social Media App',
    description: 'Interface design for a social networking application.',
    imageUrl: '/images/placeholders/gallery-8.jpg',
    category: 'UI/UX',
  },
  {
    id: 9,
    title: 'Portfolio Website',
    description: 'Creative portfolio website for a photographer.',
    imageUrl: '/images/placeholders/gallery-9.jpg',
    category: 'Web Design',
  },
  {
    id: 10,
    title: 'Food Delivery App',
    description: 'User interface for a food delivery mobile application.',
    imageUrl: '/images/placeholders/gallery-10.jpg',
    category: 'UI/UX',
  },
  {
    id: 11,
    title: 'Corporate Website',
    description: 'Professional website design for a consulting firm.',
    imageUrl: '/images/placeholders/gallery-11.jpg',
    category: 'Web Design',
  },
  {
    id: 12,
    title: 'Music Player App',
    description: 'Interface design for a music streaming application.',
    imageUrl: '/images/placeholders/gallery-12.jpg',
    category: 'UI/UX',
  },
];

// Get all unique categories
const allCategories = [
  'All',
  ...new Set(allImages.map((image) => image.category)),
];

const GalleryPage = () => {
  const [images, setImages] = useState(allImages);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Filter images based on category and search query
  useEffect(() => {
    let filtered = allImages;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((image) => image.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (image) =>
          image.title.toLowerCase().includes(query) ||
          image.description.toLowerCase().includes(query)
      );
    }

    setImages(filtered);
  }, [activeCategory, searchQuery]);

  // Handle image click to open lightbox
  const openLightbox = (image: any) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore my portfolio of web designs, UI/UX projects, and creative
            work.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

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
          </div>
        </div>

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {image.title}
                  </h3>
                  <p className="text-gray-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    {image.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <FaTimes size={24} />
              </button>

              <div className="relative h-[70vh]">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 p-4 mt-4 rounded-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {selectedImage.description}
                </p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
