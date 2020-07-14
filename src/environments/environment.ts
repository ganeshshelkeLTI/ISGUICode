// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // for Dev
  //172.20.97.65 
  //apiUrl: 'http://172.20.97.16:8080/',
  apiUrl: 'https://informdev.isg-one.com:8443/',
  // apiUrl: 'https://isgintellisourceqaws.isg-one.com:8443/',

  

  //local
  config: {
    issuer: 'https://dev-772272.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/implicit/callback',
    clientId: '0oaav54oaC3EELuoR356'
  },
  
  
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
