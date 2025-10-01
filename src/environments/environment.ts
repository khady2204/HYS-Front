// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// src/environments/environment.ts
export const environment = {
  production: false,
  // Pour le développement web (navigateur) : localhost
  // Pour l'émulateur Android : 10.0.2.2
  apiBase: 'http://api.hysinternational.com:8080',
  // Pour l'appareil physique : 192.168.1.64 (votre IP locale)
  //apiBase: 'http://192.168.1.6:8081',
  withCredentials: true            // si tu utilises cookies/session
}


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
