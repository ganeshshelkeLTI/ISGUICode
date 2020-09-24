# ng6-notify-popup
##### for Angular 6.x.
Based on
- [ ng2-notify-popup ](https://github.com/shubhi1407/ng2-notify-popup) for Angular 4.x by Shubhangi Gupta
- [ ng-notify ](https://matowens.github.io/ng-notify/) for Angular 1.x by Mat Owens

## [ View Demo - still Angular 4 version ](https://shubhi1407.github.io/ng2-notify-popup/)

## Installation

```bash
$ npm install --save ng6-notify-popup
```
## Usage
`AppModule`:
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/** IMPORTANT : IE10 and IE11 requires the following to support `@angular/animation` (which is used by this module).
Run `npm install --save web-animations-js`.
*/
import 'web-animations-js';  

// Import library
import { Ng6NotifyPopupModule } from 'ng6-notify-popup';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Add module to imports
    Ng6NotifyPopupModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its Notification service

```typescript
// You can now use this library service to show popup anywhere in angular app
import { Component } from '@angular/core';
import { Ng6NotifyPopupService } from 'ng6-notify-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Ng6NotifyPopupService]
})
export class AppComponent {

  constructor(private notify: Ng6NotifyPopupService) { }

  // to append in body
  show(text: string, type: string): void {
    this.notify.show(text, { position:'top', duration:'2000', type: 'success' });
  }
  // to append in any other component.
  showModular(text: string, type: string): void {
    this.notify.show(text, { position:'top', duration:'2000', type: 'success', location: '#modular' });
  }

```
## API
### Ng6NotifyPopupService.setConfig( options: object )
This method can be used to override the default configuration provided by the module. All params are optinal
```typescript
Ng6NotifyPopupService.setConfig({
                                position: 'top/bottom',
                                type: 'info/success/warn/error/grimace/default',
                                duration: 4000,
                                sticky: true/false,
                             })
```
### Ng6NotifyPopupService.show( text: string, options?: object )
`show()` method can be called with an optional second argument to override the global default config
```typescript
// Simple notification
Ng6NotifyPopupService.show("Success");
// Notification with options
Ng6NotifyPopupService.show("Error occured", { position: 'top', type: 'error' })
//Show notification inside a division (MUST have position:relative)
Ng6NotifyPopupService.show("Inside a div", { location: '#my-div' })
```
### Ng6NotifyPopupService.destroy()
```typescript
// Destroy any active notification
Ng6NotifyPopupService.destroy();
```

## Custom type
You can create your own `type` in CSS as follows
```CSS
.trb-wild {
  background-color: #f4a460;
  }
```
## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License
MIT © [Mark Bezrukaviy](mailto:mark.bezrukaviy@gmail.com)
MIT © [Shubhangi Gupta](mailto:shubhangi140793@gmail.com)
