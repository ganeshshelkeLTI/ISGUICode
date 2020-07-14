import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class DigitalEditAndCompareSharedService {

  private data:any;
  private survey: any;
  private emitter:EventEmitter;

  constructor() {
    this.emitter=new EventEmitter();
  }

  public setData(data){
    this.data=data;
  }

  public getData(){
    return this.data;
  }

  public setSurvey(survey){
    this.survey = survey;
  }

  public getSurvey(){
    return this.survey;
  }

  public getEmitter():EventEmitter{
    return this.emitter;
  }
}
