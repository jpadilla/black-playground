const STABLE_URL = 'https://1rctyledh3.execute-api.us-east-1.amazonaws.com/dev';
const MAIN_URL = 'https://jobmcemp35.execute-api.us-east-1.amazonaws.com/dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/stable/:path*',
        destination: `${STABLE_URL}/:path*`,
      },
      {
        source: '/api/latest/:path*',
        destination: `${MAIN_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
