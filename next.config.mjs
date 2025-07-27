/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yizprirfmglagpigsrny.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/fotos-pecas/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb', // Aumentado para 10MB para acomodar múltiplas imagens.
    },
  },
};

export default nextConfig;