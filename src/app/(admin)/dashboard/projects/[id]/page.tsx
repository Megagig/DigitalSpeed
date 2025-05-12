import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/projects/ProjectForm';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
  
  if (!project) {
    notFound();
  }
  
  return project;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProject(params.id);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Project</h1>
      
      <ProjectForm project={project} />
    </div>
  );
}
