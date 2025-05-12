import { prisma } from '@/lib/db';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentItems from '@/components/admin/RecentItems';
import DashboardCharts from '@/components/admin/DashboardCharts';
import PageTitle from '@/components/admin/PageTitle';
import { Card, CardContent } from '@/components/ui/Card';
import DashboardActions from '@/components/admin/DashboardActions';

async function getDashboardData() {
  // Get counts
  const [
    totalBlogs,
    totalProjects,
    totalProducts,
    totalGalleryItems,
    totalContacts,
    recentBlogs,
    recentProjects,
    recentProducts,
    recentContacts,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.project.count(),
    prisma.product.count(),
    prisma.gallery.count(),
    prisma.contact.count(),
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    }),
  ]);

  // Get blog categories data for chart
  const blogsByCategory = await prisma.category.findMany({
    include: {
      _count: {
        select: { blogs: true },
      },
    },
  });

  const blogCategoriesData = blogsByCategory.map((category) => ({
    category: category.name,
    count: category._count.blogs,
  }));

  // Get top selling products
  const topSellingProducts = await prisma.product.findMany({
    take: 5,
    include: {
      sales: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const productSalesData = topSellingProducts
    .map((product) => ({
      product: product.name,
      sales: product.sales.reduce((total, sale) => total + sale.quantity, 0),
    }))
    .sort((a, b) => b.sales - a.sales);

  // Get most liked projects
  const mostLikedProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { likes: 'desc' },
  });

  const projectLikesData = mostLikedProjects.map((project) => ({
    project: project.title,
    likes: project.likes,
  }));

  return {
    totalBlogs,
    totalProjects,
    totalProducts,
    totalGalleryItems,
    totalContacts,
    recentBlogs,
    recentProjects,
    recentProducts,
    recentContacts,
    blogsByCategory: blogCategoriesData,
    topSellingProducts: productSalesData,
    mostLikedProjects: projectLikesData,
  };
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard Overview"
        description="Welcome to your admin dashboard. Here's an overview of your website's performance and recent activity."
        actions={<DashboardActions />}
      />

      <DashboardStats
        totalBlogs={dashboardData.totalBlogs}
        totalProjects={dashboardData.totalProjects}
        totalProducts={dashboardData.totalProducts}
        totalGalleryItems={dashboardData.totalGalleryItems}
        totalContacts={dashboardData.totalContacts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <DashboardCharts
              blogsByCategory={dashboardData.blogsByCategory}
              topSellingProducts={dashboardData.topSellingProducts}
              mostLikedProjects={dashboardData.mostLikedProjects}
            />
          </CardContent>
        </Card>

        <RecentItems
          recentBlogs={dashboardData.recentBlogs}
          recentProjects={dashboardData.recentProjects}
          recentProducts={dashboardData.recentProducts}
          recentContacts={dashboardData.recentContacts}
        />
      </div>
    </div>
  );
}
