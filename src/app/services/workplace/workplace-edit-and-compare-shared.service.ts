import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class WorkplaceEditAndCompareSharedService {
  private data:any;
  private emitter:EventEmitter=new EventEmitter();
  getData(){
    return this.data;
  }
  
  public setData(data){
    this.data=data;
  }
  
  public getEmitter(){
    return this.emitter;
  }
  
  constructor() { }
}
