import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'piplup',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1052635005495-f9kq412d8a2i480b08qs504om10vp54o.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
