import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class UnixInputMyDataSharedService {
  private data:any;
  public scenarioSelectionData: any;

  setScenarioSelection(data)
  {
    this.scenarioSelectionData =data;
  }

  getScenarioSelection()
  {
    return this.scenarioSelectionData;
  }

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
