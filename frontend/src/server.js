export const server = "http://localhost:8000/api/v2";

export const backend_url = "http://localhost:8000/";

// Helper function to get image URL - handles both full URLs and relative paths
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  // If image is already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Otherwise, prepend backend_url for relative paths
  return `${backend_url}${imagePath}`;
};