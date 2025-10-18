// Central app configuration
// To point at a real backend, set EXPO_PUBLIC_API_URL
// e.g. EXPO_PUBLIC_API_URL=https://api.example.com

const config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || '',
  // Default page size for lazy loading
  PAGE_SIZE: 10,
};

export default config;

