import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.helpingyourself.hysfront',  // Identifiant unique pour votre app
  appName: 'Helping Yourself',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  plugins: {
    Keyboard: {
      resize: "none", // options: "body", "native", "none"
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

