import { Injectable } from '@angular/core';
import {EventEmitter} from 'events';

@Injectable({
  providedIn: 'root'
})
export class ChartCIOSharedService {

  private data:any;
  private emitter:EventEmitter;
  
  public setData(data){
  this.data=data;
  }
  
  public getData(){
    return this.data;
  }
  
  
  
  constructor() { 
  this.emitter=new EventEmitter();
  //console.log('chart data service');
    }
  
  
  public getEmitter():EventEmitter{
    return this.emitter;
  }
  
}
