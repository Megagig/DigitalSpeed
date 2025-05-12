'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUser,
  FaTag,
} from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import { ProjectWithImages } from '@/types';
import ReactMarkdown from 'react-markdown';

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/slug/${slug}`);
        
        if (!response.ok) {
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.project) {
          setProject(data.project);
          
          // Increment view count
          fetch(`/api/projects/${data.project.id}/view`, {
            method: 'POST',
          }).catch((error) =>
            console.error('Error incrementing view count:', error)
          );
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProject();
    }
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
          href="/projects"
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
        {project.category && (
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
          </div>
        )}
        
        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12">
            <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={project.images[activeImage].url}
                alt={`${project.title} - Image ${activeImage + 1}`}
                fill
                className="object-cover"
              />
            </div>
            
            {project.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {project.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-32 rounded-md overflow-hidden ${
                      activeImage === index ? 'ring-2 ring-purple-600' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${project.title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Project Overview
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
            
            {project.technologies && (
              <div className="flex flex-wrap gap-4 mb-8">
                {project.technologies.split(',').map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  View Project
                </a>
              )}
              
              {project.githubUrl && (
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
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>
              
              {project.client && (
                <div className="flex items-start">
                  <FaUser className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Client</h4>
                    <p className="text-gray-700 dark:text-gray-300">{project.client}</p>
                  </div>
                </div>
              )}
              
              {project.category && (
                <div className="flex items-start">
                  <FaTag className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Category</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <FaUser className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Likes</h4>
                  <p className="text-gray-700 dark:text-gray-300">{project.likes || 0}</p>
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
