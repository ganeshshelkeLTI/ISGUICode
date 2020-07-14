import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';


@Injectable({
  providedIn: 'root'
})

export class ApplicationDevelopmentInputMyDataSharedService {
  private register:Set<string>;
  private data:any;
  private emitter:EventEmitter;

  public scenarioSelectionData: any;
  

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

  public registerToEmitter(event:string):boolean{
let result;
  if(this.register.has(event)){
result=false;
  }else{
    this.register.add(event);
result=true;
  }
return result;
  }

  constructor() {
    this.emitter=new EventEmitter();
  this.register=new Set<string>();
  }
}

