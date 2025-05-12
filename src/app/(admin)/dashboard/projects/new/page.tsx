import ProjectForm from '@/components/admin/projects/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h1>
      
      <ProjectForm />
    </div>
  );
}
