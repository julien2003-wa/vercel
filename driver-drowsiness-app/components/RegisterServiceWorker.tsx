'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // installation PWA non critique : l'app fonctionne sans service worker
      });
    }
  }, []);

  return null;
}
