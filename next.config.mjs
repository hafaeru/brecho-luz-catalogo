// Em next.config.mjs

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
  // CORREÇÃO: Mover a configuração para dentro de `experimental`
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb', // Ou o valor que desejar, ex: '10mb'
    },
  },
};

export default nextConfig;