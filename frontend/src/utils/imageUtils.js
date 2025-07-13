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
  // Try multiple placeholder services for better reliability
  const placeholderServices = [
    `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`,
    `https://dummyimage.com/${width}x${height}/e5e7eb/6b7280&text=${encodeURIComponent(text)}`,
    `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`
  ];
  
  // Return the first service (most reliable)
  return placeholderServices[0];
};

/**
 * Creates a data URL for a simple colored placeholder
 * @param {string} text - Text to display
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @returns {string} - Data URL for the placeholder
 */
export const createDataUrlPlaceholder = (text = 'No Image', width = 80, height = 80) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = `${Math.max(12, width / 8)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Handle text wrapping for long text
  const words = text.split(' ');
  let line = '';
  let y = height / 2;
  const lineHeight = Math.max(12, width / 8) + 2;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > width - 10 && i > 0) {
      ctx.fillText(line, width / 2, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, y);
  
  return canvas.toDataURL();
}; 