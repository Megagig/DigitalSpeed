// Use a dynamic import for cloudinary to avoid Node.js module issues
let cloudinary: any;

// Initialize cloudinary only on the server side
if (typeof window === 'undefined') {
  // Server-side only
  import('cloudinary').then(({ v2 }) => {
    cloudinary = v2;
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  });
} else {
  // Client-side mock (will be replaced with actual implementation in API routes)
  cloudinary = {
    uploader: {
      upload: () => {
        throw new Error(
          'Cloudinary upload should be called from an API route, not client-side'
        );
      },
      destroy: () => {
        throw new Error(
          'Cloudinary destroy should be called from an API route, not client-side'
        );
      },
    },
  };
}

export { cloudinary };

export async function uploadImage(file: File, folder: string = 'digitalspeed') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64 = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataURI,
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });

  return result;
}

export async function uploadMultipleImages(
  files: File[],
  folder: string = 'digitalspeed'
) {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

export async function deleteImage(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, {}, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

export function getPublicIdFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');

    // Remove the file extension
    const fileNameWithExt = pathParts[pathParts.length - 1];
    const fileName = fileNameWithExt.split('.')[0];

    // Get the folder path
    const folderPath = pathParts
      .slice(pathParts.indexOf('digitalspeed'), pathParts.length - 1)
      .join('/');

    return folderPath ? `${folderPath}/${fileName}` : fileName;
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
}
