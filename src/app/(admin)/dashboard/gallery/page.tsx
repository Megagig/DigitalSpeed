import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import CloudinaryImage from '@/components/ui/CloudinaryImage';
import GalleryUploadForm from '@/components/admin/gallery/GalleryUploadForm';
import GalleryActionButtons from '@/components/admin/gallery/GalleryActionButtons';

export default async function GalleryPage() {
  const galleryItems = await prisma.gallery.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Upload New Images</h2>
        <GalleryUploadForm />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Gallery Images</h2>

        {galleryItems.length === 0 ? (
          <p className="text-gray-500">
            No gallery images found. Upload your first image!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <CloudinaryImage
                    src={item.imageUrl}
                    alt={item.title || 'Gallery image'}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <GalleryActionButtons galleryItemId={item.id} />
                </div>
                {item.title && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
