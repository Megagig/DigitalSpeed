'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { FiSend, FiStar, FiUser } from 'react-icons/fi';

const reviewSchema = z.object({
  rating: z.string().transform((val) => parseInt(val, 10)),
  content: z.string().min(1, 'Review content is required'),
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Valid email is required'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Review {
  id: string;
  rating: number;
  content: string;
  authorName: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: '5',
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const total = data.reduce((sum: number, review: Review) => sum + review.rating, 0);
          setAverageRating(Math.round((total / data.length) * 10) / 10);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post review');
      }

      // Refresh reviews
      const reviewsResponse = await fetch(`/api/products/${productId}/reviews`);
      if (!reviewsResponse.ok) {
        throw new Error('Failed to refresh reviews');
      }
      const newReviews = await reviewsResponse.json();
      setReviews(newReviews);
      
      // Recalculate average rating
      if (newReviews.length > 0) {
        const total = newReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
        setAverageRating(Math.round((total / newReviews.length) * 10) / 10);
      }

      // Reset form
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar
        key={index}
        className={`${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        } w-5 h-5`}
      />
    ));
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
              <FiStar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{review.authorName}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700">{review.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  id="rating"
                  {...register('rating')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  id="content"
                  rows={4}
                  {...register('content')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your review here..."
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    {...register('authorName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                  {errors.authorName && (
                    <p className="mt-1 text-sm text-red-600">{errors.authorName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="authorEmail"
                    {...register('authorEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email (will not be published)"
                  />
                  {errors.authorEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.authorEmail.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="mr-2" />
                {isSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
