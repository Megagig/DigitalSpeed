'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  images: {
    id: string;
    url: string;
  }[];
}

const RecentWorkSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        if (data.success && data.projects) {
          // Get only published projects
          const publishedProjects = data.projects
            .filter((project: Project) => project.published)
            .sort(
              (a: Project, b: Project) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          setProjects(publishedProjects);

          // Extract unique categories from projects
          const uniqueCategories = new Set<string>();
          publishedProjects.forEach((project: Project) => {
            // This is a simplified approach - in a real app, you might have a category field
            // For now, we'll just use the first word of the title as a mock category
            const mockCategory = project.title.split(' ')[0].toLowerCase();
            uniqueCategories.add(mockCategory);
          });

          // Create categories array with 'All' as the first option
          const categoryArray = [{ id: 'all', name: 'All' }];
          uniqueCategories.forEach((category) => {
            categoryArray.push({
              id: category,
              name: category.charAt(0).toUpperCase() + category.slice(1),
            });
          });

          setCategories(categoryArray);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => {
          // This is a simplified approach - in a real app, you'd filter by actual category
          const mockCategory = project.title.split(' ')[0].toLowerCase();
          return mockCategory === activeCategory;
        });

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Recent Work
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Here are some of my recent projects. Click on any project to see
            more details.
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                  <div className="relative h-64 w-full">
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0].url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                        <span className="text-gray-500 dark:text-gray-400">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <span className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                      {categories.find(
                        (cat) =>
                          cat.id === project.title.split(' ')[0].toLowerCase()
                      )?.name || 'Project'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300">
              No projects available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentWorkSection;
