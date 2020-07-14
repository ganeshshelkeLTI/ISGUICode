import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDevelopmentEditAndCompareSharedService {

  private data:any;
  private emitter:EventEmitter;
  public scenarioSelectionData: any;
  
  constructor() {
    this.emitter=new EventEmitter();
  }

  public setScenarioSelection(data)
  {
    this.scenarioSelectionData =data;
  }

  public getScenarioSelection()
  {
    return this.scenarioSelectionData;
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
