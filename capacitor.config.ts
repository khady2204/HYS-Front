import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
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
  }
}

  
};

export default config;
