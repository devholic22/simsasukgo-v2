import type { Metadata, Viewport } from 'next';
import { BottomNav } from '../components/bottom-nav';
import './globals.css';

export const metadata: Metadata = {
  title: '심사숙고',
  description: '여행 중 최적 이동 플랜을 위한 지도 기반 앱',
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/icon-192.png'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body className='pb-24'>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
