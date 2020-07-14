import { Injectable } from '@angular/core';
import {EventEmitter} from 'events';
@Injectable({
  providedIn: 'root'
})
export class VoiceInputMydataSharedService {

  private emitter:EventEmitter=new EventEmitter();
  constructor() { }

  private data:any;
  public scenarioData:any;

  public getScenarioSelection(){
    return this.scenarioData;
  }

  public setScenarioSelection(data){
    this.scenarioData=data;
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


}
