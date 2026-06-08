import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.komek.app',
  appName: 'Komek',
  webDir: 'out',
  server: {
    url: 'https://kurd-link-eta.vercel.app',
    cleartext: true
  }
};

export default config;
