import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { formatDate, truncate } from '@/lib/utils';

async function getHomePageData() {
  const [featuredBlogs, featuredProjects, featuredProducts] = await Promise.all([
    prisma.blog.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.project.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { images: { take: 1 } },
    }),
    prisma.product.findMany({
      where: { published: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { images: { take: 1 } },
    }),
  ]);

  return {
    featuredBlogs,
    featuredProjects,
    featuredProducts,
  };
}

export default async function HomePage() {
  const { featuredBlogs, featuredProjects, featuredProducts } = await getHomePageData();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Welcome to DigitalSpeed
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Your partner for innovative digital solutions, web development, and creative design.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/projects"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                View Our Projects
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest from Our Blog</h2>
            <p className="mt-4 text-xl text-gray-600">
              Insights, tutorials, and updates from our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {blog.featuredImage && (
                    <div className="relative h-48">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-blue-600 mb-2">
                      {blog.category?.name || 'Uncategorized'} • {formatDate(blog.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {truncate(blog.excerpt || blog.content, 120)}
                    </p>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No blog posts available yet.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Latest Projects</h2>
            <p className="mt-4 text-xl text-gray-600">
              Showcasing our recent work and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {project.images.length > 0 && (
                    <div className="relative h-56">
                      <Image
                        src={project.images[0].url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {truncate(project.description, 120)}
                    </p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No projects available yet.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop Our Products</h2>
            <p className="mt-4 text-xl text-gray-600">
              Quality digital products for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {product.images.length > 0 && (
                    <div className="relative h-48">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {truncate(product.description, 60)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toString()}
                      </span>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500">No products available yet.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Visit Shop
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let's work together to bring your ideas to life. Contact us today for a free consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
