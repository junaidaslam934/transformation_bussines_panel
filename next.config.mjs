export default {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'transformation-storage-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
