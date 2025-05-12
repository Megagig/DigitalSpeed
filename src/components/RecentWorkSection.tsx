'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Sample project data
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    slug: 'e-commerce-platform',
    category: 'website',
    image: '/project-placeholder-1.jpg',
    description: 'A full-featured e-commerce platform built with Next.js and PostgreSQL.',
  },
  {
    id: 2,
    title: 'Fitness Tracker App',
    slug: 'fitness-tracker-app',
    category: 'app',
    image: '/project-placeholder-2.jpg',
    description: 'A mobile application for tracking workouts and nutrition.',
  },
  {
    id: 3,
    title: 'Digital Marketing Campaign',
    slug: 'digital-marketing-campaign',
    category: 'digital',
    image: '/project-placeholder-3.jpg',
    description: 'A comprehensive digital marketing campaign for a local business.',
  },
  {
    id: 4,
    title: 'Blog Content Strategy',
    slug: 'blog-content-strategy',
    category: 'content',
    image: '/project-placeholder-4.jpg',
    description: 'Content strategy and creation for a tech blog.',
  },
  {
    id: 5,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    category: 'website',
    image: '/project-placeholder-5.jpg',
    description: 'A responsive portfolio website for a photographer.',
  },
  {
    id: 6,
    title: 'Task Management App',
    slug: 'task-management-app',
    category: 'app',
    image: '/project-placeholder-6.jpg',
    description: 'A task management application with team collaboration features.',
  },
];

// Filter categories
const categories = [
  { id: 'all', name: 'All' },
  { id: 'website', name: 'Website' },
  { id: 'app', name: 'Apps' },
  { id: 'digital', name: 'Digital' },
  { id: 'content', name: 'Content' },
];

const RecentWorkSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Recent Work
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Here are some of my recent projects. Click on any project to see more details.
          </p>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.id}>
              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative h-64 w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <span className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                    {categories.find(cat => cat.id === project.category)?.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentWorkSection;
