import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class UpdateCompareScreenNotificationService {
private emitter:EventEmitter;
  constructor() {
    let object=this;
    object.emitter=new EventEmitter();
   }

   getEmitter(){
     let object=this;
     return object.emitter;
   }


}
