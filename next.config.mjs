/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yizprirfmglagpigsrny.supabase.co', // <-- CORRIGIDO AQUI
        port: '',
        pathname: '/storage/v1/object/public/fotos-pecas/**',
      },
    ],
  },
};

export default nextConfig;