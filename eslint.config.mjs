/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yizprirfmlagpigssrny.supabase.co', // Exatamente este, que é o seu host do Supabase
        port: '',
        pathname: '/storage/v1/object/public/fotos-pecas/**',
      },
    ],
  },
};

export default nextConfig;