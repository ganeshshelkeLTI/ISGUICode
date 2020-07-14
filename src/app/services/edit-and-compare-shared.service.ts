import { Injectable } from '@angular/core';
import {EventEmitter} from 'events';


@Injectable({
  providedIn: 'root'
})
export class EditAndCompareSharedService {

  private data:any;
  private emitter:EventEmitter;
  private showSaveAndCompareButton:boolean;
  public setData(data){
  this.data=data;
  }

  public getData(){
    return this.data;
  }



    constructor() {
  this.emitter=new EventEmitter();
  this.showSaveAndCompareButton=true;
  
    }


  public getEmitter():EventEmitter{
    return this.emitter;
  }

  setShowSaveAndCompareButton(flag){
  this.showSaveAndCompareButton=flag;
  }

  isShowSaveAndCompareButton(){
   return this.showSaveAndCompareButton;
    }

}
