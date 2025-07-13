const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Constructs the full URL for an image, handling both relative and absolute URLs
 * @param {string} imageUrl - The image URL (can be relative or absolute)
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL (starts with http/https), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative URL, prepend the API base URL
  return `${API_BASE_URL}${imageUrl}`;
};

/**
 * Creates a fallback image URL for when the main image fails to load
 * @param {string} text - Text to display in the placeholder
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderUrl = (text = 'No+Image', width = 80, height = 80) => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
}; 