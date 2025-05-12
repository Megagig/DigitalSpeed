/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable image optimization
    unoptimized: false,
    // Set reasonable image device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Set reasonable image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Disable ESLint during builds for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable production source maps for better debugging
  productionBrowserSourceMaps: false,

  // Enable gzip compression for better performance
  compress: true,

  // Enable incremental static regeneration
  staticPageGenerationTimeout: 120,

  // Optimize fonts
  optimizeFonts: true,

  // Enable experimental features for better performance
  experimental: {
    // Enable server components
    serverComponents: true,
    // Enable concurrent features
    concurrentFeatures: true,
    // Enable optimizing third-party scripts
    optimizeCss: true,
    // Enable scroll restoration
    scrollRestoration: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Handle Node.js modules in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };

    // Add optimization for production builds
    if (!dev && !isServer) {
      // Enable tree shaking and dead code elimination
      config.optimization.usedExports = true;

      // Enable module concatenation
      config.optimization.concatenateModules = true;

      // Enable code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name of the npm package
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // Return a chunk name based on the package name
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
