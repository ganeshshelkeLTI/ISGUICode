import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class MainframeEditAndCompareSharedService {
private data:any;

getData(){
  return this.data;
}

public setData(data){
  this.data=data;
}

public getEmitter(){
  return this.emitter;
}

private emitter:EventEmitter=new EventEmitter();


  constructor() { }
}
