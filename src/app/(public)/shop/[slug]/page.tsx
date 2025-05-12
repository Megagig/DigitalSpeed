'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaCheck,
} from 'react-icons/fa';

// Sample product data (in a real app, this would come from your database)
const products = [
  {
    id: 1,
    name: 'Premium WordPress Theme',
    slug: 'premium-wordpress-theme',
    description:
      'A responsive and customizable WordPress theme for businesses and portfolios.',
    longDescription: `
      This premium WordPress theme is designed to help businesses and professionals create a stunning online presence with minimal effort. Built with performance and flexibility in mind, it offers a wide range of customization options to match your brand identity.

      ## Key Features

      - Fully responsive design that looks great on all devices
      - Drag-and-drop page builder for easy customization
      - 20+ pre-built page templates for quick setup
      - WooCommerce compatibility for online stores
      - SEO optimized code for better search engine rankings
      - Regular updates and dedicated support

      ## What's Included

      - WordPress theme files
      - Documentation and installation guide
      - 6 months of support
      - Lifetime updates
    `,
    price: 59.99,
    salePrice: 49.99,
    images: [
      '/images/placeholders/product-1.jpg',
      '/images/placeholders/product-1-2.jpg',
      '/images/placeholders/product-1-3.jpg',
    ],
    category: 'Themes',
    rating: 4.5,
    reviews: 28,
    featured: true,
    specifications: [
      { name: 'WordPress Version', value: '5.0 or higher' },
      { name: 'PHP Version', value: '7.4 or higher' },
      { name: 'Browser Support', value: 'Chrome, Firefox, Safari, Edge' },
      { name: 'Documentation', value: 'Included' },
      { name: 'Support', value: '6 months' },
      { name: 'Updates', value: 'Lifetime' },
    ],
    relatedProducts: [2, 3, 6],
  },
  {
    id: 2,
    name: 'React Component Library',
    slug: 'react-component-library',
    description:
      'A collection of reusable React components to speed up your development process.',
    longDescription: `
      This comprehensive React component library provides a collection of high-quality, reusable components that will help you build beautiful and functional user interfaces faster. Each component is designed with accessibility and performance in mind.

      ## Key Features

      - 50+ customizable components
      - Fully typed with TypeScript
      - Responsive and accessible design
      - Comprehensive documentation
      - Minimal dependencies
      - Regular updates

      ## What's Included

      - Component source code
      - TypeScript definitions
      - Storybook documentation
      - Usage examples
      - 12 months of support
    `,
    price: 39.99,
    salePrice: null,
    images: [
      '/images/placeholders/product-2.jpg',
      '/images/placeholders/product-2-2.jpg',
      '/images/placeholders/product-2-3.jpg',
    ],
    category: 'Components',
    rating: 5,
    reviews: 42,
    featured: true,
    specifications: [
      { name: 'React Version', value: '16.8 or higher' },
      { name: 'TypeScript', value: 'Included' },
      { name: 'Bundle Size', value: '45KB gzipped' },
      { name: 'Documentation', value: 'Storybook' },
      { name: 'Support', value: '12 months' },
      { name: 'License', value: 'MIT' },
    ],
    relatedProducts: [3, 7, 8],
  },
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

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the product data from your API
    const foundProduct = products.find((p) => p.slug === slug);
    setProduct(foundProduct);

    // Find related products
    if (foundProduct && foundProduct.relatedProducts) {
      const related = products.filter((p) =>
        foundProduct.relatedProducts.includes(p.id)
      );
      setRelatedProducts(related);
    }

    setLoading(false);
  }, [slug]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={product.images[activeImage]}
                alt={`${product.name} - Image ${activeImage + 1}`}
                fill
                className="object-contain"
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Sale
                </div>
              )}
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-purple-600' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <RatingStars rating={product.rating} />
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 line-through text-xl mr-3">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 text-3xl font-bold">
                    ${product.salePrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-purple-600 dark:text-purple-400 text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <label
                    htmlFor="quantity"
                    className="block text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-l-md"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-16 text-center py-2 border-y border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>

                <button
                  onClick={toggleFavorite}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-md transition-colors"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Product Highlights
              </h3>
              <ul className="space-y-2">
                {product.specifications
                  .slice(0, 3)
                  .map((spec: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>{spec.name}:</strong> {spec.value}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'specifications'
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Reviews ({product.reviews})
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            {activeTab === 'description' && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {product.longDescription
                  .split('\n')
                  .map((paragraph: string, index: number) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2
                          key={index}
                          className="text-2xl font-bold mt-6 mb-3"
                        >
                          {paragraph.substring(3)}
                        </h2>
                      );
                    } else if (paragraph.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-6">
                          {paragraph.substring(2)}
                        </li>
                      );
                    } else if (paragraph.trim() === '') {
                      return null;
                    } else {
                      return (
                        <p key={index} className="my-4">
                          {paragraph}
                        </p>
                      );
                    }
                  })}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec: any, index: number) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
                        }
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {spec.name}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <p className="text-gray-700 dark:text-gray-300">
                  Reviews functionality will be implemented in a future update.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  href={`/shop/${relatedProduct.slug}`}
                  key={relatedProduct.id}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                      {relatedProduct.salePrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                          Sale
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {relatedProduct.name}
                      </h3>

                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                        {relatedProduct.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {relatedProduct.salePrice ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 dark:text-gray-400 line-through text-sm mr-2">
                              ${relatedProduct.price.toFixed(2)}
                            </span>
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              ${relatedProduct.salePrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
