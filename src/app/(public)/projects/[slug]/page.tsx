'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

// Sample project data (in a real app, this would come from your database)
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    slug: 'e-commerce-platform',
    category: 'website',
    images: [
      '/images/placeholders/project-1-1.jpg',
      '/images/placeholders/project-1-2.jpg',
      '/images/placeholders/project-1-3.jpg',
    ],
    description: 'A full-featured e-commerce platform built with Next.js and PostgreSQL. This project includes user authentication, product management, shopping cart functionality, payment processing, and order management.',
    longDescription: `
      This e-commerce platform was built to provide a seamless shopping experience for users while giving store owners powerful tools to manage their products and orders.
      
      The frontend is built with Next.js and React, providing a fast and responsive user interface. The backend uses Node.js with Express and PostgreSQL for data storage.
      
      Key features include:
      - User authentication and profile management
      - Product catalog with categories and search functionality
      - Shopping cart and wishlist
      - Secure checkout process with multiple payment options
      - Order tracking and history
      - Admin dashboard for product and order management
      - Analytics and reporting
    `,
    client: 'RetailTech Inc.',
    startDate: '2023-01-15',
    endDate: '2023-04-30',
    designer: 'Jane Smith',
    technologies: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Stripe'],
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    isPrivate: false,
  },
  {
    id: 2,
    title: 'Fitness Tracker App',
    slug: 'fitness-tracker-app',
    category: 'app',
    images: [
      '/images/placeholders/project-2-1.jpg',
      '/images/placeholders/project-2-2.jpg',
      '/images/placeholders/project-2-3.jpg',
    ],
    description: 'A mobile application for tracking workouts and nutrition.',
    longDescription: `
      This fitness tracker app helps users monitor their workouts, nutrition, and overall health progress. Built with React Native for cross-platform compatibility.
      
      The app syncs data with a cloud database, allowing users to access their information from multiple devices and never lose their progress.
      
      Key features include:
      - Workout tracking with custom exercise creation
      - Nutrition logging and calorie counting
      - Progress photos and measurements
      - Goal setting and achievement tracking
      - Social sharing and community features
      - Integration with popular fitness wearables
      - Personalized workout and meal recommendations
    `,
    client: 'FitLife Solutions',
    startDate: '2022-09-10',
    endDate: '2023-01-05',
    designer: 'Michael Johnson',
    technologies: ['React Native', 'Firebase', 'Node.js', 'Express', 'MongoDB'],
    liveUrl: 'https://fitnesstracker.example.com',
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
    isPrivate: true,
  },
];

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch the project data from your API
    const foundProject = projects.find(p => p.slug === slug);
    setProject(foundProject);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link 
          href="/#projects"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Project Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {project.title}
        </h1>
        
        {/* Project Category */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>
        
        {/* Project Images */}
        <div className="mb-12">
          <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={project.images[activeImage]}
              alt={`${project.title} - Image ${activeImage + 1}`}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {project.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-20 w-32 rounded-md overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${project.title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Project Overview
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p>{project.longDescription}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {project.technologies.map((tech: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" />
                View Project
              </a>
              
              {project.isPrivate ? (
                <a 
                  href="https://www.buymeacoffee.com/yourusername" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md transition-colors"
                >
                  <FaGithub className="mr-2" />
                  Buy Me a Coffee for Source Code
                </a>
              ) : (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md transition-colors"
                >
                  <FaGithub className="mr-2" />
                  View Source Code
                </a>
              )}
            </div>
          </div>
          
          {/* Right Column - Project Info */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg h-fit">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Project Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FaCalendarAlt className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Date</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaUser className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Client</h4>
                  <p className="text-gray-700 dark:text-gray-300">{project.client}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaUser className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Designer</h4>
                  <p className="text-gray-700 dark:text-gray-300">{project.designer}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaTag className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Category</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
