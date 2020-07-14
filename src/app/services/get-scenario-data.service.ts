import { Injectable } from '@angular/core';
import {EventEmitter} from 'events';
@Injectable({
  providedIn: 'root'
})
export class GetScenarioDataService {

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
    }
  
  
  public getEmitter():EventEmitter{
    return this.emitter;
  }
  
}
