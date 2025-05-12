import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const base64 = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;
  
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataURI,
      {
        folder: 'digitalspeed',
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
