import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class StorageInputMyDataSharedService {

  private data:any;
  private emitter:EventEmitter;
  public scenarioSelectionData: any;

  setScenarioSelection(data)
  {
    this.scenarioSelectionData =data;
  }

  getScenarioSelection()
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

  constructor() {
    this.emitter=new EventEmitter();
  }
}
