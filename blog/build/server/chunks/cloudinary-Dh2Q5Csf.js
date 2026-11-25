import { v2 } from 'cloudinary';
import { b as private_env } from './shared-server-DaWdgxVh.js';

v2.config({
  cloud_name: private_env.CLOUDINARY_CLOUD_NAME,
  api_key: private_env.CLOUDINARY_API_KEY,
  api_secret: private_env.CLOUDINARY_API_SECRET,
  secure: true
});
async function uploadImage(file, folder = "blog") {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    const uploadStream = v2.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}
async function uploadFile(file, folder = "blog/products/files") {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
  const cleanName = originalNameWithoutExt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s.-]/g, "").replace(/[\s_]+/g, "_").substring(0, 80);
  const uniqueHash = Math.random().toString(36).substring(2, 8);
  const publicId = `${cleanName}_${uniqueHash}__${ext}`;
  return new Promise((resolve, reject) => {
    const uploadStream = v2.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        public_id: publicId
        // SEM format — a URL fica sem extensão e é acessível publicamente
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("File upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}
async function deleteFile(publicId) {
  return new Promise((resolve, reject) => {
    v2.uploader.destroy(publicId, { resource_type: "raw" }, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const rawMatch = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  if (rawMatch) return rawMatch[1];
  const imgMatch = url.match(/\/upload\/(.+)\.[a-z]+$/);
  return imgMatch ? imgMatch[1] : null;
}

export { uploadFile as a, deleteFile as d, getPublicIdFromUrl as g, uploadImage as u };
//# sourceMappingURL=cloudinary-Dh2Q5Csf.js.map
