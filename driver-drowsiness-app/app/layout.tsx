import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Test de somnolence des chauffeurs',
  description:
    'Systeme de test et de surveillance de la somnolence au volant : questionnaire, test de reactivite et detection par camera en temps reel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
