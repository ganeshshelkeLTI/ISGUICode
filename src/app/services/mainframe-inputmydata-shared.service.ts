import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class MainframeInputmydataSharedService {

  private data:any;
  private emitter:EventEmitter;
  private scenarioName:any;
  public scenarioData:any;

  public setData(data){
    this.data=data;
  }

  public getScenarioSelection(){
    return this.scenarioData;
  }

  public setScenarioSelection(data){
    this.scenarioData=data;
  }

  public getData(){
    return this.data;
  }

  public setDefaultScenarioName(scenarioName)
  {
    this.scenarioName = scenarioName;
  }

  public getDefaultScenarioName()
  {
    return this.scenarioName; 
  }


  public getEmitter():EventEmitter{
    return this.emitter;
  }

  constructor() {
    this.emitter=new EventEmitter();
    
  }
}
