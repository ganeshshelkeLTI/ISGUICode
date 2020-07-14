import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class LoginDataBroadcastService {

  private userData: any;
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
    //  console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
    //  console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  public getEmitter(): EventEmitter {
    return this.emitter;
  }

  public getEvent(){
    return this.emitter;
  }


}
