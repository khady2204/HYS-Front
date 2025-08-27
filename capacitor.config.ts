import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HYS-Front',
  webDir: 'www',

  server: {
    cleartext: true,      
    androidScheme: 'http' 
  }

  
};

export default config;
