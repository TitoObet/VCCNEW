import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'piplup',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1052635005495-773v9u0qqtd8igutn8qh5f414u65cq35.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
