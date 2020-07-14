import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class CompareCloseActionService {
private emitter:EventEmitter;
  constructor() {
let object=this;
object.emitter=new EventEmitter();

   }

   public getEmitter():EventEmitter{
     return this.emitter;
   }

}
