import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.helpingyourself.hysfront',  // Identifiant unique pour votre app
  appName: 'HYS-Front',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  plugins: {
    Keyboard: {
      resize: "body", // options: "body", "native", "none"
      style: "light",
      scrollAssist: true,
      resizeOnFullScreen: true
    },
    Camera: {
      android: {
        enableCameraPermission: true,
        enableGalleryPermission: true
      }
    }
  }
};

export default config;

