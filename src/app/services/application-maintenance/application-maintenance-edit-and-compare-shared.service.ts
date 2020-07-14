import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class ApplicationMaintenanceEditAndCompareSharedService {

  private data:any;
  private emitter:EventEmitter;

  constructor() {
    this.emitter=new EventEmitter();
  }

  public setData(data){
    this.data=data;
  }

  public getData(){
    return this.data;
  }

  public getEmitter():EventEmitter{
    return this.emitter;
  }
}
