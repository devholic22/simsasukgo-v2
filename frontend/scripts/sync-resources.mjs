import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const frontendRootPath = resolve(dirname(currentFilePath), '..');

const resourceToPublicMappings = [
  {
    source: resolve(frontendRootPath, 'resources/icons/apple-icon.png'),
    destination: resolve(frontendRootPath, 'public/apple-touch-icon.png'),
  },
  {
    source: resolve(frontendRootPath, 'resources/icons/icon-192.png'),
    destination: resolve(frontendRootPath, 'public/icon-192.png'),
  },
  {
    source: resolve(frontendRootPath, 'resources/icons/icon-512.png'),
    destination: resolve(frontendRootPath, 'public/icon-512.png'),
  },
  {
    source: resolve(frontendRootPath, 'resources/icons/icon.svg'),
    destination: resolve(frontendRootPath, 'public/icon.svg'),
  },
  {
    source: resolve(frontendRootPath, 'resources/pwa/sw.js'),
    destination: resolve(frontendRootPath, 'public/sw.js'),
  },
];

for (const mapping of resourceToPublicMappings) {
  if (!existsSync(mapping.source)) {
    throw new Error(`Missing resource file: ${mapping.source}`);
  }

  mkdirSync(dirname(mapping.destination), { recursive: true });
  copyFileSync(mapping.source, mapping.destination);
}

const publicRootPath = resolve(frontendRootPath, 'public');
for (const fileName of readdirSync(publicRootPath)) {
  if (fileName.startsWith('workbox-') && fileName.endsWith('.js')) {
    rmSync(resolve(publicRootPath, fileName), { force: true });
  }
}

console.log('Synchronized frontend/resources -> frontend/public');
