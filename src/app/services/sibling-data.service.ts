import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiblingDataService {

  private enterDataHeaderMessageSource = new BehaviorSubject(false);
  private enterDataModalMessageSource = new BehaviorSubject(false);

  enterDataHeaderFlagMessage = this.enterDataHeaderMessageSource.asObservable();
  enterDataModalFlagMessage = this.enterDataModalMessageSource.asObservable();

  constructor() { }

  changeEnterDataHeaderFlag(headerOptionflag: boolean) {
    this.enterDataHeaderMessageSource.next(headerOptionflag)
  }

  changeEnterDataModalFlag(enterDataModalFlg:boolean){
    this.enterDataModalMessageSource.next(enterDataModalFlg)
  }

}
