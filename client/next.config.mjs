/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'rida-ecome.s3.me-central-1.amazonaws.com',
            
          },
        ],
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
