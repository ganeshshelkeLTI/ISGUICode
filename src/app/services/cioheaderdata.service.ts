import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class CioheaderdataService {

  private data: any;
  private registeredFunction: any;
  private emitter: EventEmitter;
  private _emitter: EventEmitter;
  //this is being added because i want all currencies from header
  public currencies: any;
  public scenarioData: any;
  public CRGdata: any;
  constructor(private router: Router) {

    this.emitter = new EventEmitter();
    this._emitter = new EventEmitter();

    

  }



  public setData(data) {
    this.data = data;
  }

  public getData(): any {
    return this.data;
  }

  public getEventEmitter() {
    return this.emitter;
  }

  public getEvent() {
    return this._emitter;
  }

  public setScenario(data) {
    this.scenarioData = data;
  }

  public getScenario() {
    return this.scenarioData;
  }

  public setCRGData(data) {
    this.CRGdata = data;
  }

  public getCRGData() {
    return this.CRGdata;
  }

}
