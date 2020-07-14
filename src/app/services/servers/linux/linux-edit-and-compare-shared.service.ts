import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class LinuxEditAndCompareSharedService {

  private data:any;
  private emitter:EventEmitter;

  public setData(data){
    this.data=data;
  }

  public getData(){
    return this.data;
  }

  public getEmitter():EventEmitter{
    return this.emitter;
  }

  constructor() {
    this.emitter=new EventEmitter();
  }
}
