import { Injectable } from '@angular/core';
import {EventEmitter} from 'events';
@Injectable({
  providedIn: 'root'
})
export class CIOEnterMyDataSharedService {
  private data:any;
  private emitter:EventEmitter;
  public scenariodata;

  public setData(data){
  this.data=data;
  }
  
  public getData(){
    return this.data;
  }
  
  public setScenarioSelection(data)
  {
    this.scenariodata = data
  }
  
  public getScenarioSelection()
  {
    return this.scenariodata;
  }
  
  public getEmitter():EventEmitter{
    return this.emitter;
  }
  
  constructor() {  this.emitter=new EventEmitter();
    
   }
}
