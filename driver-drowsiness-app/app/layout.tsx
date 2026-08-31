import type { Metadata, Viewport } from 'next';
import './globals.css';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';

export const metadata: Metadata = {
  title: 'Test de somnolence des chauffeurs',
  description:
    'Systeme de test et de surveillance de la somnolence au volant : questionnaire, test de reactivite et detection par camera en temps reel.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anti-Somnolence',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <RegisterServiceWorker />
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
