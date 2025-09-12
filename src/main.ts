import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  flashOutline,
  cameraReverseOutline,
  micOffOutline,
  imagesOutline,
  cameraOutline,
  videocamOutline,
  ellipseOutline,
  person,
  personCircleOutline,
  lockClosedOutline
} from 'ionicons/icons';

// Enregistrement des icônes Ionic utilisées dans ajouter-media
addIcons({
  'arrow-back-outline': arrowBackOutline,
  'flash-outline': flashOutline,
  'camera-reverse-outline': cameraReverseOutline,
  'mic-off-outline': micOffOutline,
  'images-outline': imagesOutline,
  'camera-outline': cameraOutline,
  'ellipse-outline': ellipseOutline,
  'videocam-outline': videocamOutline,
  'person-circle-outline': personCircleOutline,
  'lock-closed-outline': lockClosedOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
     provideHttpClient(withInterceptors([
      authInterceptor
     ]))
  ],
});
