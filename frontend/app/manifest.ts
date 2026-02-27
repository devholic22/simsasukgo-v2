import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '심사숙고',
    short_name: '심사숙고',
    description: '여행 중 최적 이동 플랜을 위한 지도 기반 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2f68ff',
    lang: 'ko',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
