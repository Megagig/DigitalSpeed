'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import {
  FiSend,
  FiMessageSquare,
  FiUser,
  FiThumbsUp,
  FiHeart,
  FiSmile,
} from 'react-icons/fi';
import {
  FaRegSmile,
  FaRegLaughSquint,
  FaRegSadTear,
  FaRegAngry,
  FaRegSurprise,
} from 'react-icons/fa';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Valid email is required'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentReaction {
  id: string;
  emoji: string;
  userName: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  isApproved: boolean;
  likes: number;
  replies: Comment[];
  reactions: CommentReaction[];
}

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // Watch the name field to use for reactions
  const watchedName = watch('authorName');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const commentData = {
        ...data,
        parentId: replyingTo,
      };

      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      // Refresh comments
      const commentsResponse = await fetch(`/api/blogs/${blogId}/comments`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to refresh comments');
      }
      const newComments = await commentsResponse.json();
      setComments(newComments);

      // Reset form
      reset();
      setReplyingTo(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    // Scroll to comment form
    document
      .getElementById('comment-form')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      // Refresh comments to show updated like count
      const commentsResponse = await fetch(`/api/blogs/${blogId}/comments`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to refresh comments');
      }

      const newComments = await commentsResponse.json();
      setComments(newComments);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const toggleEmojiPicker = (commentId: string) => {
    setShowEmojiPicker(showEmojiPicker === commentId ? null : commentId);
    // Store the current user name for reactions
    if (watchedName) {
      setUserName(watchedName);
    }
  };

  const addReaction = async (commentId: string, emoji: string) => {
    try {
      // Use the watched name if available, otherwise use "Anonymous"
      const name = userName || watchedName || 'Anonymous';

      const response = await fetch(`/api/comments/${commentId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji,
          userName: name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reaction');
      }

      // Close emoji picker
      setShowEmojiPicker(null);

      // Refresh comments to show updated reactions
      const commentsResponse = await fetch(`/api/blogs/${blogId}/comments`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to refresh comments');
      }

      const newComments = await commentsResponse.json();
      setComments(newComments);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiMessageSquare className="mr-2" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{comment.authorName}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>

                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={() => handleLike(comment.id)}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          <FiThumbsUp className="mr-1" />
                          <span>
                            {comment.likes > 0 ? comment.likes : ''} Like
                          </span>
                        </button>

                        <button
                          onClick={() => toggleEmojiPicker(comment.id)}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          <FiSmile className="mr-1" />
                          <span>React</span>
                        </button>

                        <button
                          onClick={() => handleReply(comment.id)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FiMessageSquare className="mr-1" />
                          <span>Reply</span>
                        </button>
                      </div>

                      {/* Emoji Picker */}
                      {showEmojiPicker === comment.id && (
                        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md mb-2">
                          <button
                            onClick={() => addReaction(comment.id, '😊')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Smile"
                          >
                            😊
                          </button>
                          <button
                            onClick={() => addReaction(comment.id, '❤️')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Love"
                          >
                            ❤️
                          </button>
                          <button
                            onClick={() => addReaction(comment.id, '😂')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Laugh"
                          >
                            😂
                          </button>
                          <button
                            onClick={() => addReaction(comment.id, '😮')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Wow"
                          >
                            😮
                          </button>
                          <button
                            onClick={() => addReaction(comment.id, '😢')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Sad"
                          >
                            😢
                          </button>
                          <button
                            onClick={() => addReaction(comment.id, '😡')}
                            className="text-xl hover:bg-gray-200 p-1 rounded"
                            title="Angry"
                          >
                            😡
                          </button>
                        </div>
                      )}

                      {/* Display Reactions */}
                      {comment.reactions && comment.reactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          {comment.reactions.map((reaction) => (
                            <div
                              key={reaction.id}
                              className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center"
                              title={`${reaction.userName} reacted with ${reaction.emoji}`}
                            >
                              <span className="mr-1">{reaction.emoji}</span>
                              <span className="text-gray-600">
                                {reaction.userName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-white p-3 rounded-lg"
                            >
                              <div className="flex items-start">
                                <div className="bg-gray-100 rounded-full p-2 mr-3">
                                  <FiUser className="text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium">
                                      {reply.authorName}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                      {formatDistanceToNow(
                                        new Date(reply.createdAt),
                                        { addSuffix: true }
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div id="comment-form" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              {replyingTo ? 'Leave a Reply' : 'Leave a Comment'}
            </h3>

            {replyingTo && (
              <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-md">
                <span className="text-sm text-blue-700">
                  Replying to a comment
                </span>
                <button
                  onClick={cancelReply}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Cancel Reply
                </button>
              </div>
            )}

            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                Your comment will be reviewed by a moderator before it appears
                on the site.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Comment
                </label>
                <textarea
                  id="content"
                  rows={4}
                  {...register('content')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your comment here..."
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="authorName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.authorName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="authorEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.authorEmail.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="mr-2" />
                {isSubmitting
                  ? 'Submitting...'
                  : replyingTo
                  ? 'Post Reply'
                  : 'Post Comment'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
