'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

// Sample project data (in a real app, this would come from your database)
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    slug: 'e-commerce-platform',
    category: 'website',
    image: '/images/placeholders/project-1-1.jpg',
    description:
      'A full-featured e-commerce platform built with Next.js and PostgreSQL.',
  },
  {
    id: 2,
    title: 'Fitness Tracker App',
    slug: 'fitness-tracker-app',
    category: 'app',
    image: '/images/placeholders/project-2-1.jpg',
    description: 'A mobile application for tracking workouts and nutrition.',
  },
  {
    id: 3,
    title: 'Digital Marketing Campaign',
    slug: 'digital-marketing-campaign',
    category: 'digital',
    image: '/images/placeholders/project-3-1.jpg',
    description:
      'A comprehensive digital marketing campaign for a local business.',
  },
  {
    id: 4,
    title: 'Blog Content Strategy',
    slug: 'blog-content-strategy',
    category: 'content',
    image: '/images/placeholders/project-4-1.jpg',
    description: 'Content strategy and creation for a tech blog.',
  },
  {
    id: 5,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    category: 'website',
    image: '/images/placeholders/project-5-1.jpg',
    description: 'A responsive portfolio website for a photographer.',
  },
  {
    id: 6,
    title: 'Task Management App',
    slug: 'task-management-app',
    category: 'app',
    image: '/images/placeholders/project-6-1.jpg',
    description:
      'A task management application with team collaboration features.',
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

const ProjectsPage = () => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on category and search query
  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(
        (project) => project.category === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore my portfolio of web development projects and creative work.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
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
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-56 w-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                        {
                          categories.find((cat) => cat.id === project.category)
                            ?.name
                        }
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects found
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

export default ProjectsPage;
