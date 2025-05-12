'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';

const GalleryPage = () => {
  const [allImages, setAllImages] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();

        if (data) {
          setAllImages(data);
          setImages(data);

          // Extract categories
          const uniqueCategories = new Set<string>();
          data.forEach((image: any) => {
            if (image.category) {
              uniqueCategories.add(image.category);
            }
          });

          setCategories(['All', ...Array.from(uniqueCategories)]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

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
          (image.title && image.title.toLowerCase().includes(query)) ||
          (image.description && image.description.toLowerCase().includes(query))
      );
    }

    setImages(filtered);
  }, [activeCategory, searchQuery, allImages]);

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
              {categories.map((category, index) => (
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.url}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {image.title || 'Untitled'}
                  </h3>
                  {image.category && (
                    <p className="text-gray-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                      {image.category}
                    </p>
                  )}
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
                  src={selectedImage.url}
                  alt={selectedImage.title || 'Gallery image'}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 p-4 mt-4 rounded-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedImage.title || 'Untitled'}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {selectedImage.description}
                  </p>
                )}
                {selectedImage.category && (
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
