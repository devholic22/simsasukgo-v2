'use client';

import { useEffect } from 'react';

const SERVICE_WORKER_PATH = '/sw.js';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.isSecureContext || !('serviceWorker' in navigator)) {
      return;
    }

    void navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => undefined);
  }, []);

  return null;
}
